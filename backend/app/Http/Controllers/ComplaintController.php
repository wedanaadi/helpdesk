<?php

namespace App\Http\Controllers;

use App\Libraries\Fungsi;
use App\Models\File as FileKeluhan;
use App\Models\Keluhan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ComplaintController extends Controller
{
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
      $newTiket = Fungsi::KodeGenerate($lastKode->kode, 5, 6, 'T', $date);
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
          $fileName = 'file-' . "=" . preg_replace('/\s+/', '', $dataImage->getClientOriginalName());
          $dataImage->move($destinationPath, $fileName);
          array_push($dataFile, [
            'id' => Str::uuid()->toString(),
            'keluhan_id' => $newTiket,
            'file' => $fileName,
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
}
