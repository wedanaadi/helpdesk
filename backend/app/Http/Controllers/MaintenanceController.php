<?php

namespace App\Http\Controllers;

use App\Jobs\SendMailPelanggan;
use App\Jobs\SendNotifTeknisi;
use App\Libraries\Fungsi;
use App\Models\Keluhan;
use App\Models\Log;
use App\Models\Maintenance;
use App\Models\MaintenanceReport;
use App\Models\Pegawai;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MaintenanceController extends Controller
{
  // ! NOTE : Kode untuk menampilkan data maintenance
  public function index()
  {
    $data = Maintenance::filter(request(['search']))
      ->with(
        'teknisi',
        'keluhans',
        'keluhans.pelanggan',
        'keluhans.pelanggan.kelurahan',
        'keluhans.pelanggan.kelurahan.kecamatan',
        'keluhans.pelanggan.kelurahan.kecamatan.kabkot',
        'keluhans.pelanggan.kelurahan.kecamatan.kabkot.provinsi',
        'keluhans.files'
      )
      ->select(
        '*',
        DB::raw("IF(status='0','ON',IF(status='1','SOLVED','PENDING')) AS status_desc"),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(expired_date/1000),"%Y-%m-%d %H:%i:%s") as expired_date2')
      )
      ->OrderBy('status', 'ASC')
      ->OrderBy('tiket_maintenance', 'ASC');
    if (request('role') === '3') {
      $data->where('pegawai_id', request('idUser'));
    }
    return response()->json(['msg' => 'Get Maintenance', "data" => $data->paginate(request('perpage')), 'error' => []], 200);
  }

  // ! NOTE : Kode untuk menampilkan data detail maintenance
  public function detail()
  {
    $data = Maintenance::filter(request(['search']))
      ->with(
        'teknisi',
        'keluhans',
        'keluhans.pelanggan',
        'keluhans.pelanggan.kelurahan',
        'keluhans.pelanggan.kelurahan.kecamatan',
        'keluhans.pelanggan.kelurahan.kecamatan.kabkot',
        'keluhans.pelanggan.kelurahan.kecamatan.kabkot.provinsi',
        'keluhans.files'
      )
      ->select(
        '*',
        DB::raw("IF(status='0','ON',IF(status='1','SOLVED','PENDING')) AS status_desc"),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(expired_date/1000),"%Y-%m-%d %H:%i:%s") as expired_date')
      )
      ->OrderBy('status', 'ASC')
      ->OrderBy('tiket_maintenance', 'ASC');
    $data->where('tiket_maintenance', request('ticketMaintenance'));
    return response()->json(['msg' => 'Get Maintenance', "data" => $data->first(), 'error' => []], 200);
  }

  // ! NOTE : Kode untuk menambah data baru
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
      $prevTicket = Maintenance::where('tiket_keluhan', $request->ticket_keluhan);
      $expired_date = $prevTicket->count() > 0 ? $prevTicket->first()->expired_date : strtotime(date("Y-m-d H:i:s") . "+3 days") * 1000;
      if ($prevTicket->count() > 0 and (int)$expired_date < round(microtime(true) * 1000)) {
        $newTiket = $prevTicket->first()->tiket_maintenance;
      } else {
        $date = date('y') . date('m');
        $lastKode = Maintenance::select(DB::raw('MAX(tiket_maintenance) AS kode'))
          ->where(DB::raw('SUBSTR(tiket_maintenance,2,4)'), $date)
          ->first();
        $newTiket = Fungsi::KodeGenerate($lastKode->kode, 5, 6, 'M', $date);
      }
      // $currentDateTime = Carbon::now();
      $expired_date = Carbon::now()->addDays(3)->timestamp;
      $payload = [
        'pegawai_id' => $request->teknisi,
        'tiket_keluhan' => $request->ticket_keluhan,
        'tiket_maintenance' => $newTiket,
        'expired_date' => round($expired_date * 1000),
        // 'expired_date' => (strtotime(date("Y-m-d H:i:s") . "+3 days")) * 1000,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      Keluhan::where('tiket', $request->ticket_keluhan)->update([
        'status' => '2',
        'updated_user' => $request->user_update,
      ]);
      $datakeluhan = Keluhan::with('pelanggan')->where('tiket', $request->ticket_keluhan)->first();
      $teknisi = Pegawai::where('id', $request->teknisi)->first();

      $dataEmail = [
        'message' => ['Ticket Maintenance berhasil dibuat.' . PHP_EOL . 'Teknisi yang ditugaskan: ' . $teknisi->nama_pegawai],
        'ticket_keluhan' => $datakeluhan->tiket,
        'ticket_maintenance' => $newTiket,
        'subject' => 'Updated Penanganan Ticket Complaint',
        'email' => $datakeluhan->pelanggan->email,
      ];

      $pegawaiData = Pegawai::find($request->teknisi);
      $dataEmailTeknisi = [
        'message' => ['Anda ditugaskan untuk menangani keluhan'],
        'ticket_keluhan' => $datakeluhan->tiket,
        'ticket_maintenance' => $newTiket,
        'subject' => 'Penugasan Penanganan',
        'email' => $pegawaiData->email,
        'teknisi' => $request->teknisi,
        'public_url' => $request->public_url . "/maintenance/teknisi/v?ticket=" . $newTiket
      ];

      $dataLog = [
        'keluhan_id' => $request->ticket_keluhan,
        'relasi_log' => $newTiket,
        'user_id' => $request->teknisi,
        'updated_by' => $request->user_update,
        'deskripsi' => 'Ticket Maintenance dibuat".',
        'type' => '2',
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      Log::create($dataLog);
      if ($prevTicket->count() > 0 and (int)$expired_date < round(microtime(true) * 1000)) {
        $prevTicket->update($payload);
      } else {
        Maintenance::create($payload);
      }
      // $this->sendEmail($dataEmail);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data maintenance', 'data' => ['payload' => $payload, "email" => $dataEmail, "emailTeknisi" => $dataEmailTeknisi], 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed created data maintenance', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE : Kode untuk mengubah data
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
      Keluhan::where('tiket', $request->_ticket_keluhan)->update(['status' => '0']);
      $payload = [
        'pegawai_id' => $request->teknisi,
        // 'note' => $request->note,
        'tiket_keluhan' => $request->ticket_keluhan,
        'updated_at' => round(microtime(true) * 1000),
      ];
      Keluhan::where('tiket', $request->ticket_keluhan)->update([
        'status' => '2',
        'updated_user' => $request->user_update,
      ]);
      $prevLog = Log::where('relasi_log', $find->tiket_maintenance)
        ->where('type', '2')
        ->firstOrFail();

      $keluhan = Keluhan::with('pelanggan')->where('tiket', $find->tiket_keluhan)->first();
      $dataEmail = [
        'message' => ['Ticket Maintenance berhasil diubah.'],
        'ticket_keluhan' => $find->tiket_keluhan,
        'ticket_maintenance' => $find->tiket_maintenance,
        'subject' => 'Updated Penanganan Ticket Complaint',
        'email' => $keluhan->pelanggan->email,
      ];

      $pegawaiData = Pegawai::find($request->teknisi);
      $dataEmailTeknisi = [
        'message' => ['Anda ditugaskan untuk menangani keluhan'],
        'ticket_keluhan' => $find->tiket_keluhan,
        'ticket_maintenance' => $find->tiket_maintenance,
        'subject' => 'Penugasan Penanganan',
        'email' => $pegawaiData->email,
        'teknisi' => $request->teknisi,
        'public_url' => $request->public_url . "/maintenance/teknisi/v?ticket=" . $find->tiket_maintenance
      ];

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
      return response()->json(['msg' => 'Successfuly update data maintenance', "data" => ['payload' => $payload, "email" => $dataEmail, "emailTeknisi" => $dataEmailTeknisi], 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed update data maintenance', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE : Kode untuk menghapus data
  public function destroy($id)
  {
    $find = Maintenance::findOrFail($id);
    DB::beginTransaction();
    try {
      Keluhan::where('tiket', $find->tiket_keluhan)->update(['status' => '0']);
      Log::where('keluhan_id', $find->tiket_keluhan)
        ->where('type', '!=', '1')->delete();
      $find->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data maintenance', "data" => [], 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed delete data maintenance', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE : Kode untuk mengubah status ticket menjadi solved atau pending
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
        'updated_by' => $maintenance->pegawai_id,
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
      $isExist = MaintenanceReport::where('keluhan_id', $maintenance->tiket_keluhan);
      if ($isExist->count() > 0) {
        $isExist->first()->update($reportSolve);
      } else {
        MaintenanceReport::create($reportSolve);
      }

      $keluhan = Keluhan::with('pelanggan')->where('tiket', $maintenance->tiket_keluhan)->first();
      $dataEmail = [
        // 'message' => 'Ticket Maintenance berhasil diubah.',
        'ticket_keluhan' => $maintenance->tiket_keluhan,
        'ticket_maintenance' => $maintenance->tiket_maintenance,
        'subject' => 'Updated Penanganan Ticket Complaint',
        'email' => $keluhan->pelanggan->email,
      ];

      $maintenance->update($payload);
      if ($request->status == "1") {
        Keluhan::where('tiket', $maintenance->tiket_keluhan)->update([
          'status' => '1',
          'updated_user' => $request->user_update
        ]);
        $dataLog['deskripsi'] = 'Status ticket dirubah menjadi solved.' . PHP_EOL . $request->deskripsi;
        // $dataEmail['message'] = 'Status ticket dirubah menjadi solved.' . PHP_EOL . $request->deskripsi;
        $dataEmail['message'] = ['Status ticket dirubah menjadi solved.', $request->deskripsi];
      } else {
        $dataLog['deskripsi'] = 'Status ticket dirubah menjadi pending.' . PHP_EOL . $request->deskripsi;
        // $dataEmail['message'] = 'Status ticket dirubah menjadi pending.' . PHP_EOL . $request->deskripsi;
        $dataEmail['message'] = ['Status ticket dirubah menjadi pending.', $request->deskripsi];
      }
      Log::create($dataLog);
      DB::commit();
      return response()->json(['msg' => 'Successfuly update status', "data" => ['payload' => $payload, "email" => $dataEmail], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail update status', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE : Kode untuk mengirim email notifikasi
  public function sendEmail(Request $request)
  {
    dispatch(new SendMailPelanggan($request->all()));
    return response()->json(['msg' => 'Successfuly send email', "data" => null, 'error' => null], 200);
  }

  // ! NOTE : Kode untuk mengirim email ke teknisi
  public function sendEmailTeknisi(Request $request)
  {
    dispatch(new SendNotifTeknisi($request->all()));
    return response()->json(['msg' => 'Successfuly send email Teknisi', "data" => null, 'error' => null], 200);
  }

  // ! NOTE : Kode untuk mangubah expired date
  public function changeExpiredDate(Request $request, $id)
  {
    $data = Maintenance::find($id);
    DB::beginTransaction();
    try {
      $data->update([
        'expired_date' => $request->newExpDate
      ]);
      DB::commit();
      return response()->json(['msg' => 'Successfuly update data expired', "data" => [
        'expired_date' => $request->newExpDate
      ], 'error' => null], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed update data Kategori', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE : Kode untuk mengubah teknisi yang ditugaskan
  public function changeTeknisi(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'newTeknisi' => 'required',
    ], [
      'newTeknisi.required' => 'Input Teknisi Baru harus diisi!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    $data = Maintenance::find($id);
    DB::beginTransaction();
    try {
      $data->update([
        'pegawai_id' => $request->newTeknisi['value']
      ]);

      $dataOldEmail = [
        'message' => ['Penugasan penanganan ticket maintenance dibatalkan.' . PHP_EOL . 'Teknisi baru sudah ditugaskan.'],
        'ticket_keluhan' => $request->ticket_keluhan,
        'ticket_maintenance' => $request->ticket_maintenance,
        'subject' => 'Pembatalan Penugasan Penanganan Ticket Complaint',
        'email' => $request->prevEmailTeknisi,
      ];

      $pegawaiData = Pegawai::find($request->newTeknisi['value']);
      $dataEmailTeknisi = [
        'message' => ['Anda ditugaskan untuk menangani keluhan'],
        'ticket_keluhan' => $request->ticket_keluhan,
        'ticket_maintenance' => $request->ticket_maintenance,
        'subject' => 'Penugasan Penanganan',
        'email' => $pegawaiData->email,
        'teknisi' => $request->newTeknisi['value'],
        'public_url' => $request->public_url . "/maintenance/teknisi/v?ticket=" . $request->ticket_maintenance
      ];

      $dataLog = [
        'keluhan_id' => $request->ticket_keluhan,
        'relasi_log' => $request->ticket_maintenance,
        'user_id' => $request->newTeknisi['value'],
        'updated_by' => $request->user_update,
        'deskripsi' => 'Ticket Maintenance dirubah".',
        'type' => '4',
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      Log::create($dataLog);
      DB::commit();
      return response()->json(['msg' => 'Successfuly update data expired', "data" => [
        'expired_date' => $request->newExpDate, 'emailPembatalan' => $dataOldEmail, 'emailBaru' => $dataEmailTeknisi
      ], 'error' => null], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed update data Kategori', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE : Kode Tracking Ticket di maintenance
  public function logEmailTrack(Request $request)
  {
    $sql = "SELECT logs_email.*, pegawais.nama_pegawai FROM logs_email
    JOIN pegawais on pegawais.email = logs_email.`to`
    WHERE ticket_id = '$request->ticket'
    ORDER BY time_delevery DESC";
    $data = DB::select($sql);
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }
}
