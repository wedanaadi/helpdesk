<?php

namespace App\Http\Controllers;

use App\Jobs\SendMailCreated;
use App\Libraries\Fungsi;
use App\Models\Pelanggan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\PelanggansImport;
use Illuminate\Support\Facades\Hash;

class PelangganController extends Controller
{
  public function index()
  {
    $data = Pelanggan::filter(request(['search']))
      ->with('kelurahan', 'kelurahan.kecamatan', 'kelurahan.kecamatan.kabkot', 'kelurahan.kecamatan.kabkot.provinsi')
      // ->where('is_aktif', "1")
      ->OrderBy('id', 'ASC')
      ->OrderBy('is_aktif', 'DESC')
      ->paginate(request('perpage'));
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function showPelanggan(Request $request)
  {
    $data = Pelanggan::find($request->id);
    return response()->json(['msg' => 'find pegawais', "data" => $data, 'error' => []], 200);
  }

  public function changeProfile(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'nama' => 'required',
      'email' => 'required|email',
      'telepon' => 'required',
      'alamat' => 'required',
      'kordinat' => 'required',
    ], [
      'email' => 'Format email salah!',
      'required' => 'Input :attribute harus diisi!',
      // 'role.required' => 'Input jabatan harus diisi!',
      'unique' => 'Input :attribute sudah digunakan!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    $find = Pelanggan::findOrFail($request->idUser);
    DB::beginTransaction();
    try {
      $userData = User::where('relasi_id', $request->idUser);
      $kordinat = explode(', ',$request->kordinat);
      $payload = [
        'nama_pelanggan' => $request->nama,
        'email' => $request->email,
        'alamat' => $request->alamat,
        'telepon' => $request->telepon,
        'lat' => $kordinat[0],
        'long' => $kordinat[1],
      ];

      if ($request->profile) {
        $dataImage = $request->profile;
        $destinationPath = storage_path('app') . '/public/img';
        $fileName = 'profile-' . Str::uuid()->toString() . "=" . preg_replace('/\s+/', '', $dataImage->getClientOriginalName());
        // // $extensi = $dataImage->getClientOriginalExtension();
        $dataImage->move($destinationPath, $fileName);
        if ($request->oldProfile !== '-') {
          unlink($destinationPath.'/' . $request->oldProfile);
        }
        $payload['profil'] = $fileName;
      }

      $payloadUser = [];
      if($request->password != '' OR $request->password != null) {
        $payloadUser['password'] = Hash::make($request->password);
      }

      if($request->username != '' OR $request->username != null) {
        $payloadUser['username'] = $request->username;
      }

      $find->update($payload);
      if(count($payloadUser) > 0) {
        $userData->update($payloadUser);
      }
      $newData = Pelanggan::find($request->idUser);
      DB::commit();
      return response()->json(['msg' => 'Successfuly update data pegawai', "data" => ['payload' => $newData, 'email' => null], 'error' => null], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed update data pegawai', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function select(Request $request)
  {
    $pro = DB::select('SELECT * FROM pelanggans ORDER BY is_aktif DESC, nama_pelanggan ASC');
    $data = [];
    foreach ($pro as $d) {
      array_push($data, [
        'label' => $d->nama_pelanggan,
        'value' => $d->id
      ]);
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function provinsi(Request $request)
  {
    $pro = DB::select('SELECT * FROM provinces WHERE id="51"');
    $data = [];
    foreach ($pro as $d) {
      array_push($data, [
        'label' => $d->name,
        'value' => $d->id
      ]);
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function kabkot(Request $request)
  {
    $data = [];
    if ($request->provId) {
      $kabkot = DB::select("SELECT * FROM regencies WHERE province_id = '$request->provId'");
      foreach ($kabkot as $d) {
        array_push($data, [
          'label' => $d->name,
          'value' => $d->id
        ]);
      }
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function kecamatan(Request $request)
  {
    $data = [];
    if ($request->regId) {
      $kabkot = DB::select("SELECT * FROM districts WHERE regency_id = '$request->regId'");
      foreach ($kabkot as $d) {
        array_push($data, [
          'label' => $d->name,
          'value' => $d->id
        ]);
      }
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function kelurahan(Request $request)
  {
    $data = [];
    if ($request->discId) {
      $kabkot = DB::select("SELECT * FROM villages WHERE district_id = '$request->discId'");
      foreach ($kabkot as $d) {
        array_push($data, [
          'label' => $d->name,
          'value' => $d->id
        ]);
      }
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'nama_pelanggan' => 'required',
      'email' => 'required|unique:pelanggans|email',
      'telepon' => 'required',
      'alamat' => 'required',
      'provinsi' => 'required',
      'kabkot' => 'required',
      'kecamatan' => 'required',
      'kelurahan' => 'required',
      'lat' => 'required',
      'long' => 'required',
    ], [
      'email' => 'Format email salah!',
      'required' => 'Input :attribute harus diisi!',
      'unique' => 'Input :attribute sudah digunakan!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $date = date('y') . date('m');
      $lastKode = Pelanggan::select(DB::raw('MAX(id) AS kode'))
        ->where(DB::raw('SUBSTR(id,2,4)'), $date)
        ->first();
      $newID = Fungsi::KodeGenerate($lastKode->kode, 5, 6, 'P', $date);
      $payload = [
        'id' => $newID,
        'nama_pelanggan' => $request->nama_pelanggan,
        'email' => $request->email,
        'alamat' => $request->alamat,
        'telepon' => $request->telepon,
        'provinsi' => $request->provinsi,
        'kabkot' => $request->kabkot,
        'kecamatan' => $request->kecamatan,
        'kelurahan' => $request->kelurahan,
        'lat' => $request->lat,
        'long' => $request->long,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      $payloadUser = [
        'username' => $newID,
        'password' => bcrypt($newID),
        'role' => "4",
        'relasi_id' => $payload['id'],
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      Pelanggan::create($payload);
      User::create($payloadUser);
      $dataEmail = [
        'message' => 'Selamat, Akun berhasil dibuat!.',
        'subject' => 'Created Data',
        'username' => $newID,
        'password' => $newID,
        'email' => $request->email,
        'public_url' => $request->public_url
      ];
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data pelanggan', "data" => ['payload' => $payload, 'email' => $dataEmail], 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed created data pelanggan', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function update(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'nama_pelanggan' => 'required',
      'email' => 'required|email|unique:pelanggans,email,' . $id . ',id',
      'telepon' => 'required',
      'alamat' => 'required',
      'provinsi' => 'required',
      'kabkot' => 'required',
      'kecamatan' => 'required',
      'kelurahan' => 'required',
      'lat' => 'required',
      'long' => 'required',
    ], [
      'email' => 'Format email salah!',
      'required' => 'Input :attribute harus diisi!',
      'unique' => 'Input :attribute sudah digunakan!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    $find = Pelanggan::findOrFail($id);
    DB::beginTransaction();
    try {
      $userData = User::where('relasi_id', $id);
      $payload = [
        'nama_pelanggan' => $request->nama_pelanggan,
        'email' => $request->email,
        'alamat' => $request->alamat,
        'telepon' => $request->telepon,
        'provinsi' => $request->provinsi,
        'kabkot' => $request->kabkot,
        'kecamatan' => $request->kecamatan,
        'kelurahan' => $request->kelurahan,
        'lat' => $request->lat,
        'long' => $request->long,
        'updated_at' => round(microtime(true) * 1000),
      ];
      $payloadUser = [
        'username' => $id,
        'password' => bcrypt($id),
        'role' => "4",
        'relasi_id' => $id,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      $find->update($payload);
      $userData->update($payloadUser);
      $dataEmail = [
        'message' => 'Selamat, Akun berhasil diubah!.',
        'subject' => 'Updated Data',
        'username' => $id,
        'password' => $id,
        'email' => $request->email,
        'public_url' => $request->public_url
      ];
      DB::commit();
      return response()->json(['msg' => 'Successfuly updated data pelanggan', "data" => ['payload' => $payload, 'email' => $dataEmail], 'error' => null], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed updated data pelanggan', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function destroy(Request $request, $id)
  {
    $find = Pelanggan::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'is_aktif' => $request->value,
        'updated_at' => round(microtime(true) * 1000),
      ];
      $find->update($payload);
      // User::where('relasi_id', $id)->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly update data delete', "data" => $payload, 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed update data delete', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function sendEmail(Request $request)
  {
    dispatch(new SendMailCreated($request->all()));
    return response()->json(['msg' => 'Successfuly send email', "data" => null, 'error' => null], 200);
  }

  public function import(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'file' => 'required',
    ], [
      'required' => 'Input :attribute harus diisi!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      Excel::import(new PelanggansImport, request()->file('file'));
      DB::commit();
      return response()->json(['msg' => 'Successfuly import data pelanggan', "data" => [], 'error' => null], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed created data pelanggan', "data" => null, 'error' => $e->getMessage()], 500);
    }
    // Excel::import(new PelanggansImport, request()->file('file'));
    // return response()->json(['test'=>$a, 'adi' =>'fdjh']);
    // $dataImage = $request->file;
    // $destinationPath = 'images/file';
    // $destinationPath = storage_path('app') . '/public/file';
    // $fileName = 'file-' . Str::uuid()->toString() . "=" . preg_replace('/\s+/', '', $dataImage->getClientOriginalName());
    // // $extensi = $dataImage->getClientOriginalExtension();
    // $dataImage->move($destinationPath, $fileName);
  }
}
