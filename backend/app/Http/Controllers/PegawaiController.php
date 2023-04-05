<?php

namespace App\Http\Controllers;

use App\Jobs\SendMailCreated;
use App\Models\Pegawai;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PegawaiController extends Controller
{
  // ! NOTE : Kode untuk menampilkan data pegawai
  public function index()
  {
    $data = Pegawai::filter(request(['search']))
      ->with('user')
      ->where('is_aktif', "1")
      ->OrderBy('nama_pegawai', 'ASC')
      ->paginate(request('perpage'));
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  // ! NOTE : Kode untuk menambah data baru
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'nama_pegawai' => 'required',
      'email' => 'required|unique:pegawais|email',
      'telepon' => 'required',
      'alamat' => 'required',
      'username' => 'required|unique:users',
      'password' => 'required',
      'role' => 'required',
    ], [
      'email' => 'Format email salah!',
      'required' => 'Input :attribute harus diisi!',
      'role.required' => 'Input jabatan harus diisi!',
      'unique' => 'Input :attribute sudah digunakan!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $payload = [
        'id' => Str::uuid()->toString(),
        'nama_pegawai' => $request->nama_pegawai,
        'email' => $request->email,
        'alamat' => $request->alamat,
        'telepon' => $request->telepon,
        'role' => $request->role,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      $payloadUser = [
        'username' => $request->username,
        'password' => bcrypt($request->password),
        'role' => $request->role,
        'relasi_id' => $payload['id'],
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      Pegawai::create($payload);
      User::create($payloadUser);
      $dataEmail = [
        'message' => 'Selamat, Akun berhasil dibuat!.',
        'subject' => 'Created Data',
        'username' => $request->username,
        'password' => $request->password,
        'email' => $request->email,
        'public_url' => $request->public_url
      ];
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data pegawai', "data" => ['payload' => $payload, 'email' => $dataEmail], 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed created data pegawai', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE : Kode untuk mengubah data
  public function update(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'nama_pegawai' => 'required',
      'email' => 'required|email',
      'telepon' => 'required',
      'alamat' => 'required',
      'username' => 'required',
      'role' => 'required',
    ], [
      'email' => 'Format email salah!',
      'required' => 'Input :attribute harus diisi!',
      'role.required' => 'Input jabatan harus diisi!',
      'unique' => 'Input :attribute sudah digunakan!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    $find = Pegawai::findOrFail($id);
    DB::beginTransaction();
    try {
      $userData = User::where('relasi_id', $id);
      $payload = [
        'nama_pegawai' => $request->nama_pegawai,
        'email' => $request->email,
        'alamat' => $request->alamat,
        'telepon' => $request->telepon,
        'role' => $request->role,
        'updated_at' => round(microtime(true) * 1000),
      ];
      $payloadUser = [
        'username' => $request->username,
        'role' => $request->role,
        'relasi_id' => $id,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      $dataEmail = [
        'message' => 'Selamat, Akun berhasil dirubah!.',
        'subject' => 'Updated Data',
        'username' => $request->username,
        'password' => 'Gunakan password lama',
        'email' => $request->email,
        'public_url' => $request->public_url
      ];
      if ($request->password != '' or $request->password != null) {
        $payloadUser['password'] = Hash::make($request->password);
        $dataEmail['password'] = $request->password;
      }
      $find->update($payload);
      $userData->update($payloadUser);
      // User::create($payloadUser);
      DB::commit();
      return response()->json(['msg' => 'Successfuly update data pegawai', "data" => ['payload' => $payload, 'email' => $dataEmail], 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed update data pegawai', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE: Kode untuk menampilkan profil pegawai
  public function showPegawai(Request $request)
  {
    $data = Pegawai::find($request->id);
    return response()->json(['msg' => 'find pegawais', "data" => $data, 'error' => []], 200);
  }

  // ! NOTE: Kode untuk mengubah profil pegawai
  public function changeProfile(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'nama' => 'required',
      'email' => 'required|email',
      'telepon' => 'required',
      'alamat' => 'required',
    ], [
      'email' => 'Format email salah!',
      'required' => 'Input :attribute harus diisi!',
      // 'role.required' => 'Input jabatan harus diisi!',
      'unique' => 'Input :attribute sudah digunakan!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    $find = Pegawai::findOrFail($request->idUser);
    DB::beginTransaction();
    try {
      $userData = User::where('relasi_id', $request->idUser);
      $payload = [
        'nama_pegawai' => $request->nama,
        'email' => $request->email,
        'alamat' => $request->alamat,
        'telepon' => $request->telepon,
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
      $newData = Pegawai::findOrFail($request->idUser);
      DB::commit();
      return response()->json(['msg' => 'Successfuly update data pegawai', "data" => ['payload' => $newData, 'email' => null], 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed update data pegawai', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE: Kode untuk menghapus / nonaktifkan pegawai
  public function destroy($id)
  {
    $find = Pegawai::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'is_aktif' => "0",
        'updated_at' => round(microtime(true) * 1000),
      ];
      $find->update($payload);
      User::where('relasi_id', $id)->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly update data delete', "data" => $payload, 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed update data delete', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE: Kode untuk mengirim email notifikasi
  public function sendEmail(Request $request)
  {
    dispatch(new SendMailCreated($request->all()));
    return response()->json(['msg' => 'Successfuly send email', "data" => null, 'error' => null], 200);
  }

  // ! NOTE: Kode untuk menampikan data pegawai di dropdown
  public function select(Request $request)
  {
    $pro = DB::select('SELECT * FROM pegawais WHERE role="3"');
    $data = [];
    foreach ($pro as $d) {
      array_push($data, [
        'label' => $d->nama_pegawai,
        'value' => $d->id
      ]);
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  // ! NOTE: Kode untuk menampikan data pegawai di dropdown di kirim pesan
  public function select_sender(Request $request)
  {
    $pro = DB::select('SELECT * FROM pegawais WHERE id != "' . $request->idUser . '"');
    $data = [];
    foreach ($pro as $d) {
      array_push($data, [
        'label' => $d->nama_pegawai,
        'value' => $d->id
      ]);
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }
}
