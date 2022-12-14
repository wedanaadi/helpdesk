<?php

namespace App\Http\Controllers;

use App\Libraries\Fungsi;
use App\Models\File as FileKeluhan;
use App\Models\Keluhan;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ComplaintController extends Controller
{
  /**
   * index
   *
   * @return void
   */
  public function index()
  {
    $data = Keluhan::filter(request(['search']))
      ->with('pelanggans','kategoris')
      ->where('is_aktif','1')
      ->OrderBy('status', 'ASC')
      ->OrderBy('tiket', 'ASC')
      ->paginate(request('perpage'));
    return response()->json(['msg' => 'Get keluhan', "data" => $data, 'error' => []], 200);
  }
  /**
   * store
   *
   * @param  mixed $request
   * @return void
   */
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'pelanggan' => 'required',
      'kategori' => 'required',
      'komentar' => 'required',
    ], [
      'required' => 'Input :attribute harus diisi!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $date = date('y') . date('m');
      $lastKode = Keluhan::select(DB::raw('MAX(tiket) AS kode'))
        ->where(DB::raw('SUBSTR(tiket,2,4)'), $date)
        ->first();
      $newTiket = Fungsi::KodeGenerate($lastKode->kode, 5, 6, 'K', $date);
      $payload = [
        'tiket' => $newTiket,
        'pelanggan_id' => $request->pelanggan,
        'kategori_id' => $request->kategori,
        'comment' => $request->komentar,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];

      // bagin upload file done
      $dataFile = [];
      if ($request->isFile === 'true') {
        for ($i = 0; $i < count($request->all()['files']); $i++) {
          $dataImage = $request->all()['files'][$i];
          // $destinationPath = public_path().'/images/pegawai'; --> unuk folder public
          $destinationPath = storage_path('app') . '/public/file';
          $fileName = 'file-'.Str::uuid()->toString(). "=" . preg_replace('/\s+/', '', $dataImage->getClientOriginalName());
          $extensi = $dataImage->getClientOriginalExtension();
          $dataImage->move($destinationPath, $fileName);
          array_push($dataFile, [
            'id' => Str::uuid()->toString(),
            'keluhan_id' => $newTiket,
            'file' => $fileName,
            'ext' => $extensi,
            'created_at' => round(microtime(true) * 1000),
            'updated_at' => round(microtime(true) * 1000),
          ]);
        }
      }
      Keluhan::create($payload);
      if (count($dataFile) > 0) {
        FileKeluhan::insert($dataFile);
      }
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data keluhan', "data" => $payload, 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed created data keluhan', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function update(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'pelanggan' => 'required',
      'kategori' => 'required',
      'komentar' => 'required',
    ], [
      'required' => 'Input :attribute harus diisi!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    $find = Keluhan::find($id);
    DB::beginTransaction();
    try {
      $payload = [
        'pelanggan_id' => $request->pelanggan,
        'kategori_id' => $request->kategori,
        'comment' => $request->komentar,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];

      // bagin upload file done
      $dataFile = [];
      if ($request->isFile === 'true') {
        foreach ($request->_files as $old) {
          $destinationPath = storage_path('app') . '/public/file';
          // return $destinationPath;
          unlink( $destinationPath.'/'.$old['file']);
        }
        FileKeluhan::where('keluhan_id',$find->tiket)->delete();
        for ($i = 0; $i < count($request->all()['files']); $i++) {
          $dataImage = $request->all()['files'][$i];
          // $destinationPath = public_path().'/images/pegawai'; --> unuk folder public
          $destinationPath = storage_path('app') . '/public/file';
          $fileName = 'file-'.Str::uuid()->toString(). "=" . preg_replace('/\s+/', '', $dataImage->getClientOriginalName());
          $extensi = $dataImage->getClientOriginalExtension();
          $dataImage->move($destinationPath, $fileName);
          array_push($dataFile, [
            'id' => Str::uuid()->toString(),
            'keluhan_id' => $find->tiket,
            'file' => $fileName,
            'ext' => $extensi,
            'created_at' => round(microtime(true) * 1000),
            'updated_at' => round(microtime(true) * 1000),
          ]);
        }
      }
      $find->update($payload);
      if (count($dataFile) > 0) {
        FileKeluhan::insert($dataFile);
      }
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data keluhan', "data" => $payload, 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed created data keluhan', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function files($id)
  {
    $data = FileKeluhan::where('keluhan_id',$id)->get();
    return response()->json(['msg' => 'Get keluhan', "data" => $data, 'error' => []], 200);
  }

  public function destroy($id)
  {
    $pegawaiFind = Keluhan::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'is_aktif' => "0"
      ];

      $pegawaiFind->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data keluhan', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail delete data keluhan', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }
}
