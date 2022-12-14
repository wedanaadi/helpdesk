<?php

namespace App\Http\Controllers;

use App\Libraries\Fungsi;
use App\Models\Keluhan;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MaintenanceController extends Controller
{
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'teknisi' => 'required',
    ], [
      'required' => 'Input :attribute harus diisi!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $date = date('y') . date('m');
      $lastKode = Maintenance::select(DB::raw('MAX(tiket_maintenance) AS kode'))
        ->where(DB::raw('SUBSTR(tiket_maintenance,2,4)'), $date)
        ->first();
      $newTiket = Fungsi::KodeGenerate($lastKode->kode, 5, 6, 'M', $date);
      $payload = [
        'pegawai_id' => $request->teknisi,
        'note' => $request->note,
        'tiket_keluhan' => $request->ticket_keluhan,
        'tiket_maintenance' => $newTiket,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      Keluhan::where('tiket',$request->ticket_keluhan)->update([
        'status' => '2'
      ]);
      Maintenance::create($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data maintenance', "data" => $payload, 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed created data maintenance', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }
}
