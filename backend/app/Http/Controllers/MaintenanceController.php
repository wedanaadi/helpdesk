<?php

namespace App\Http\Controllers;

use App\Libraries\Fungsi;
use App\Models\Keluhan;
use App\Models\Log;
use App\Models\Maintenance;
use App\Models\MaintenanceReport;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MaintenanceController extends Controller
{
  public function index()
  {
    $data = Maintenance::filter(request(['search']))
      ->with('teknisi', 'keluhan','keluhan.pelanggan',
      'keluhan.pelanggan.kelurahan',
      'keluhan.pelanggan.kelurahan.kecamatan',
      'keluhan.pelanggan.kelurahan.kecamatan.kabkot',
      'keluhan.pelanggan.kelurahan.kecamatan.kabkot.provinsi',
      'keluhan.files')
      ->select('*',DB::raw("IF(status='0','ON',IF(status='1','SOLVED','PENDING')) AS status_desc"),
      DB::raw('DATE_FORMAT(FROM_UNIXTIME(expired_date/1000),"%Y-%m-%d %H:%i:%s") as expired_date'))
      ->OrderBy('status', 'ASC')
      ->OrderBy('tiket_maintenance', 'ASC');
    if(request('role')==='3') {
      $data->where('pegawai_id',request('idUser'));
    }
    return response()->json(['msg' => 'Get Maintenance', "data" => $data->paginate(request('perpage')), 'error' => []], 200);
  }

  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'ticket_keluhan' => 'required',
      'teknisi' => 'required',
    ], [
      'required' => 'Input :attribute harus diisi!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $prevTicket = Maintenance::where('tiket_keluhan',$request->ticket_keluhan);
      $expired_date = $prevTicket->count() > 0 ? $prevTicket->first()->expired_date : strtotime(date("Y-m-d H:i:s")."+3 days")*1000;
      if($prevTicket->count() > 0 AND (int)$expired_date < round(microtime(true) * 1000)) {
        $newTiket = $prevTicket->first()-> tiket_maintenance;
      } else {
        $date = date('y') . date('m');
        $lastKode = Maintenance::select(DB::raw('MAX(tiket_maintenance) AS kode'))
          ->where(DB::raw('SUBSTR(tiket_maintenance,2,4)'), $date)
          ->first();
        $newTiket = Fungsi::KodeGenerate($lastKode->kode, 5, 6, 'M', $date);
      }
      $payload = [
        'pegawai_id' => $request->teknisi,
        'note' => $request->note,
        'tiket_keluhan' => $request->ticket_keluhan,
        'tiket_maintenance' => $newTiket,
        'expired_date' => strtotime(date("Y-m-d H:i:s")."+3 days")*1000,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      Keluhan::where('tiket', $request->ticket_keluhan)->update([
        'status' => '2'
      ]);
      $dataLog = [
        'keluhan_id' => $request->ticket_keluhan,
        'relasi_log' => $newTiket,
        'user_id' => $request->teknisi,
        'deskripsi' => 'Ticket Maintenance dibuat".',
        'type' => '2',
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      Log::create($dataLog);
      if($prevTicket->count() > 0 AND (int)$expired_date < round(microtime(true) * 1000)) {
        $prevTicket->update($payload);
      } else {
        Maintenance::create($payload);
      }
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data maintenance', "data" => $payload, 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed created data maintenance', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function update(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'ticket_keluhan' => 'required',
      'teknisi' => 'required',
    ], [
      'required' => 'Input :attribute harus diisi!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    $find = Maintenance::findOrFail($id);
    DB::beginTransaction();
    try {
      Keluhan::where('tiket',$request->_ticket_keluhan)->update(['status'=>'0']);
      // $date = date('y') . date('m');
      // $lastKode = Maintenance::select(DB::raw('MAX(tiket_maintenance) AS kode'))
      //   ->where(DB::raw('SUBSTR(tiket_maintenance,2,4)'), $date)
      //   ->first();
      // $newTiket = Fungsi::KodeGenerate($lastKode->kode, 5, 6, 'M', $date);
      $payload = [
        'pegawai_id' => $request->teknisi,
        'note' => $request->note,
        'tiket_keluhan' => $request->ticket_keluhan,
        'updated_at' => round(microtime(true) * 1000),
      ];
      Keluhan::where('tiket', $request->ticket_keluhan)->update([
        'status' => '2'
      ]);
      $prevLog = Log::where('relasi_log',$find->tiket_maintenance)
                  ->where('type','2')
                  ->firstOrFail();
      $dataLog = [
        'keluhan_id' => $request->ticket_keluhan,
        'relasi_log' => $find->tiket_maintenance,
        'user_id' => $request->teknisi,
        'deskripsi' => 'Ticket Maintenance dibuat".',
        'type' => '2',
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      $find->update($payload);
      $prevLog->update($dataLog);
      DB::commit();
      return response()->json(['msg' => 'Successfuly update data maintenance', "data" => $payload, 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed update data maintenance', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function destroy($id)
  {
    $find = Maintenance::findOrFail($id);
    DB::beginTransaction();
    try {
      Keluhan::where('tiket',$find->tiket_keluhan)->update(['status'=>'0']);
      Log::where('keluhan_id',$find->tiket_keluhan)
          ->where('type','!=','1')->delete();
      $find->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data maintenance', "data" => [], 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed delete data maintenance', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function changeStatus(Request $request, $id)
  {
    $maintenance = Maintenance::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'status' => $request->status
      ];

      $dataLog = [
        'keluhan_id' => $maintenance->tiket_keluhan,
        'relasi_log' => $maintenance->tiket_maintenance,
        'user_id' => $maintenance->pegawai_id,
        'type' => '3',
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];

      $reportSolve = [
        'keluhan_id' => $maintenance->tiket_keluhan,
        'status' => $request->status,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];

      $isExist = MaintenanceReport::where('keluhan_id',$maintenance->tiket_keluhan);
      if($isExist->count() > 0) {
        $isExist->first()->update($reportSolve);
      } else {
        MaintenanceReport::create($reportSolve);
      }

      $maintenance->update($payload);
      if($request->status == "1") {
        Keluhan::where('tiket',$maintenance->tiket_keluhan)->update(['status'=>'1']);
        $dataLog['deskripsi'] = 'Status ticket dirubah menjadi solved.';
      } else {
        $dataLog['deskripsi'] = 'Status ticket dirubah menjadi pending.';
      }
      Log::create($dataLog);
      DB::commit();
      return response()->json(['msg' => 'Successfuly update status', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail update status', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }
}