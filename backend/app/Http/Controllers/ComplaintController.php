<?php

namespace App\Http\Controllers;

use App\Imports\KeluhansImport;
use App\Jobs\SendMailKeluhan;
use App\Libraries\Fungsi;
use App\Models\File as FileKeluhan;
use App\Models\Kategori;
use App\Models\Keluhan;
use App\Models\Log;
use App\Models\Maintenance;
use App\Models\MaintenanceReport;
use App\Models\Pelanggan;
use App\Models\SolveReport;
use App\Models\UpdateComplaint;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class ComplaintController extends Controller
{
  /**
   * index
   *
   * @return void
   */
  public function index(Request $request)
  {
    if ($request->role === '4') {
      $data = Keluhan::filter(request(['search']))
        ->with(
          'pelanggan',
          'kategori',
          'pelanggan.kelurahan',
          'pelanggan.kelurahan.kecamatan',
          'pelanggan.kelurahan.kecamatan.kabkot',
          'pelanggan.kelurahan.kecamatan.kabkot.provinsi',
          'files'
        )
        ->select(
          '*',
          DB::raw('date_format(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d %H:%i:%s") as created_at2'),
          DB::raw('IF(status = "0","ON",IF(status= "1","SOLVE","ON PROSES")) as status_keluhan'),
          DB::raw('DATE_FORMAT(date_add(FROM_UNIXTIME(created_at/1000),INTERVAL 3 day),"%Y-%m-%d %H:%i:%s") as expired_date')
        )
        // ->selectRaw('*, created_at AS "tanggal_tiket"')
        ->where('is_aktif', '1')
        ->where('pelanggan_id', $request->id)
        ->OrderBy('status', 'ASC')
        ->OrderBy('tiket', 'ASC')
        ->paginate(request('perpage'));
    } else {
      $data = Keluhan::filter(request(['search']))
        ->with(
          'pelanggan',
          'kategori',
          'pelanggan.kelurahan',
          'pelanggan.kelurahan.kecamatan',
          'pelanggan.kelurahan.kecamatan.kabkot',
          'pelanggan.kelurahan.kecamatan.kabkot.provinsi',
          'files'
        )
        ->select(
          '*',
          DB::raw('date_format(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d %H:%i:%s") as created_at2'),
          DB::raw('IF(status = "0","ON",IF(status= "1","SOLVED","ON PROSES")) as status_keluhan'),
          DB::raw('DATE_FORMAT(date_add(FROM_UNIXTIME(created_at/1000),INTERVAL 3 day),"%Y-%m-%d %H:%i:%s") as expired_date')
        )
        // ->selectRaw('*, created_at AS "tanggal_tiket"')
        ->where('is_aktif', '1')
        ->where('pelanggan_id', $request->idPelanggan)
        ->OrderBy('status', 'ASC')
        ->OrderBy('tiket', 'ASC')
        ->paginate(request('perpage'));
    }
    return response()->json(['msg' => 'Get keluhan', "data" => $data, 'error' => []], 200);
  }

  public function listPelangganKeluhan()
  {
    $data = Keluhan::filter(request(['search']))
    ->with('pelanggan')
    ->groupBy('pelanggan_id')
    ->paginate(request('perpage'));
    return response()->json(['msg' => 'Get keluhan', "data" => $data, 'error' => []], 200);
  }

  public function notifikasi_keluhan()
  {
    $data = Keluhan::where('status','0')
    ->select('*',DB::raw('date_format(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d %H:%i:%s") as human_created_at'))
    ->groupBy('pelanggan_id')
    ->orderBy('created_at','DESC')
    ->limit(5)
    ->get();
    return response()->json(['msg' => 'Get keluhan', "data" => $data, 'error' => []], 200);
  }

  public function index_pelanggan(Request $request)
  {
    $data = Keluhan::filter(request(['search']))
      ->with(
        'pelanggan',
        'kategori',
        'pelanggan.kelurahan',
        'pelanggan.kelurahan.kecamatan',
        'pelanggan.kelurahan.kecamatan.kabkot',
        'pelanggan.kelurahan.kecamatan.kabkot.provinsi',
        'files'
      )
      ->select(
        '*',
        DB::raw('date_format(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d %H:%i:%s") as created_at2'),
        DB::raw('IF(status = "0","ON",IF(status= "1","SOLVE","ON PROSES")) as status_keluhan'),
        DB::raw('DATE_FORMAT(date_add(FROM_UNIXTIME(created_at/1000),INTERVAL 3 day),"%Y-%m-%d %H:%i:%s") as expired_date')
      )
      // ->selectRaw('*, created_at AS "tanggal_tiket"')
      ->where('is_aktif', '1')
      ->where('pelanggan_id', $request->id)
      ->where('status', '!=', "1")
      ->OrderBy('status', 'ASC')
      ->OrderBy('tiket', 'ASC');
    return response()->json(['msg' => 'Get keluhan', "data" => $data->get(), 'error' => []], 200);
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
      $dataPelanggan  = Pelanggan::find($request->pelanggan);
      $kategori = Kategori::find($request->kategori);
      $prevTicket = Keluhan::where('kategori_id', $request->kategori)
        ->where('pelanggan_id', $request->pelanggan)
        ->where('is_aktif', "1")
        ->where('status', '!=', "1");
      if ($prevTicket->count() > 0) {
        $newTiket = $prevTicket->first()->tiket;
      } else {
        $date = date('y') . date('m');
        $lastKode = Keluhan::select(DB::raw('MAX(tiket) AS kode'))
          ->where(DB::raw('SUBSTR(tiket,2,4)'), $date)
          ->first();
        $newTiket = Fungsi::KodeGenerate($lastKode->kode, 5, 6, 'K', $date);
      }
      $payload = [
        'tiket' => $newTiket,
        'pelanggan_id' => $request->pelanggan,
        'kategori_id' => $request->kategori,
        'comment' => $request->komentar,
        'created_user' => $request->created_user,
        'updated_user' => $request->updated_user,
        'expired_date' => strtotime(date("Y-m-d H:i:s") . "+3 days") * 1000,
        'status' => '0',
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];

      $dataEmail = [
        'message' => ['Selamat, Ticket Keluhan Telah dibuat!.'],
        'nomor' => $newTiket,
        'kategori' => $kategori->nama_kategori,
        'email' => $dataPelanggan->email,
      ];

      // bagin upload file done
      $dataFile = [];
      if ($request->isFile === 'true') {
        for ($i = 0; $i < count($request->all()['files']); $i++) {
          $dataImage = $request->all()['files'][$i];
          // $destinationPath = public_path().'/images/pegawai'; --> unuk folder public
          $destinationPath = storage_path('app') . '/public/file';
          $fileName = 'file-' . Str::uuid()->toString() . "=" . preg_replace('/\s+/', '', $dataImage->getClientOriginalName());
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

      $dataLog = [
        'keluhan_id' => $newTiket,
        'relasi_log' => $newTiket,
        'type' => '1',
        'user_id' => $request->pelanggan,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
        'updated_by' => $request->updated_user,
      ];

      if ($prevTicket->count() > 0) {
        $prevTicket->update($payload);
        $dataLog['deskripsi'] = 'Ticket Keluhan di updated.';
        $dataEmail['subject'] = 'Updated Ticket Complaint';
      } else {
        Keluhan::create($payload);
        $dataEmail['subject'] = 'Created Ticket Complaint';
        $dataLog['deskripsi'] = 'Ticket Keluhan di buat.';
      }

      Log::create($dataLog);

      if (count($dataFile) > 0) {
        FileKeluhan::insert($dataFile);
      }
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data keluhan', "data" => ['payload' => $payload, 'email' => $dataEmail], 'error' => null], 201);
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
    $dataPelanggan  = Pelanggan::find($request->pelanggan);
    $kategori = Kategori::find($request->kategori);
    DB::beginTransaction();
    try {
      $payload = [
        'pelanggan_id' => $request->pelanggan,
        'kategori_id' => $request->kategori,
        'comment' => $request->komentar,
        'created_user' => $request->created_user,
        'updated_user' => $request->updated_user,
        'updated_at' => round(microtime(true) * 1000),
      ];

      $dataEmail = [
        'message' => ['Selamat, Ticket Keluhan berhasil dirubah!.'],
        'nomor' => $find->tiket,
        'kategori' => $kategori->nama_kategori,
        'subject' => 'Updated Ticket Complaint',
        'email' => $dataPelanggan->email,
      ];

      // bagin upload file done
      $dataFile = [];
      if ($request->isFile === 'true') {
        if ($request->is_File === 'true') {
          foreach ($request->_files as $old) {
            $destinationPath = storage_path('app') . '/public/file';
            // return $destinationPath;
            unlink($destinationPath . '/' . $old['file']);
          }
          FileKeluhan::where('keluhan_id', $find->tiket)->delete();
        }
        for ($i = 0; $i < count($request->all()['files']); $i++) {
          $dataImage = $request->all()['files'][$i];
          // $destinationPath = public_path().'/images/pegawai'; --> unuk folder public
          $destinationPath = storage_path('app') . '/public/file';
          $fileName = 'file-' . Str::uuid()->toString() . "=" . preg_replace('/\s+/', '', $dataImage->getClientOriginalName());
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

      $dataLog = [
        'keluhan_id' => $find->tiket,
        'relasi_log' => $find->tiket,
        'deskripsi' => 'Ticket Keluhan di updated.',
        'user_id' => $request->pelanggan,
        'type' => '1',
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
        'updated_by' => $request->updated_user,
      ];

      $find->update($payload);
      Log::create($dataLog);
      if (count($dataFile) > 0) {
        FileKeluhan::insert($dataFile);
      }
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data keluhan', "data" => ['payload' => $payload, 'email' => $dataEmail], 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed created data keluhan', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function files($id)
  {
    $data = FileKeluhan::where('keluhan_id', $id)->get();
    return response()->json(['msg' => 'Get keluhan', "data" => $data, 'error' => []], 200);
  }

  public function destroy($id)
  {
    $keluhan = Keluhan::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'is_aktif' => "0"
      ];

      $keluhan->update($payload);
      Log::where('keluhan_id',$keluhan->tiket)->delete();
      DB::commit();
      return response()->json(['msg' => 'Successfuly delete data keluhan', "data" => $payload, 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail delete data keluhan', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function solve(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'keluhan_id' => 'required',
      'deskripsi' => 'required',
    ], [
      'required' => 'Input :attribute harus diisi!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    $keluhanFind = Keluhan::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'status' => $request->status,
        'updated_user' =>  $request->user_update,
      ];

      $dataLog = [
        'keluhan_id' => $keluhanFind->tiket,
        'relasi_log' => $keluhanFind->tiket,
        'user_id' => $keluhanFind->pelanggan_id,
        'updated_by' => $request->user_update,
        'deskripsi' => 'Ticket keluhan telah terselesaikan (solved by sistem).' . PHP_EOL . $request->deskripsi,
        'type' => '1',
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];

      $dataPelanggan  = Pelanggan::find($keluhanFind->pelanggan_id);
      $kategori = Kategori::find($keluhanFind->kategori_id);
      $dataEmail = [
        'message' => ['Ticket keluhan telah terselesaikan (solved by sistem).',$request->deskripsi],
        // 'message' => 'Ticket keluhan telah terselesaikan (solved by sistem).' . PHP_EOL . $request->deskripsi,
        'nomor' => $keluhanFind->tiket,
        'kategori' => $kategori->nama_kategori,
        'subject' => 'Updated Penanganan Ticket Complaint',
        'email' => $dataPelanggan->email,
      ];

      $keluhanFind->update($payload);
      Log::create($dataLog);
      // UpdateComplaint::create($updateKeluhan);
      $maintenance = Maintenance::where('tiket_keluhan',$keluhanFind->tiket);
      if($maintenance->count()>0) {
        $maintenance->first()->delete();
      }
      $maintenanceReport = MaintenanceReport::where('keluhan_id',$keluhanFind->tiket);
      if($maintenanceReport->count()>0) {
        $maintenanceReport->first()->delete();
      }
      DB::commit();
      return response()->json(['msg' => 'Successfuly update status', "data" => ['payload' => $payload, 'email' => $dataEmail], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail update status', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function onProccess(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'keluhan_id' => 'required',
      'deskripsi' => 'required',
    ], [
      'required' => 'Input :attribute harus diisi!',
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    $keluhanFind = Keluhan::findOrFail($id);
    DB::beginTransaction();
    try {
      $payload = [
        'status' => '2',
        'updated_user' =>  $request->user_update,
      ];

      $dataLog = [
        'keluhan_id' => $keluhanFind->tiket,
        'relasi_log' => $keluhanFind->tiket,
        'user_id' => $keluhanFind->pelanggan_id,
        'updated_by' => $request->user_update,
        'deskripsi' => 'Status ticket menjadi ON PROCCESS.' . PHP_EOL . $request->deskripsi,
        'type' => '1',
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];

      $dataPelanggan  = Pelanggan::find($keluhanFind->pelanggan_id);
      $kategori = Kategori::find($keluhanFind->kategori_id);
      $dataEmail = [
        'message' => ['Status ticket menjadi ON PROCCESS.',$request->deskripsi],
        // 'message' => 'Status ticket menjadi ON PROCCESS.' . PHP_EOL . $request->deskripsi,
        'nomor' => $keluhanFind->tiket,
        'kategori' => $kategori->nama_kategori,
        'subject' => 'Updated Penanganan Ticket Complaint',
        'email' => $dataPelanggan->email,
      ];

      $keluhanFind->update($payload);
      Log::create($dataLog);
      // // UpdateComplaint::create($updateKeluhan);
      $maintenance = Maintenance::where('tiket_keluhan',$keluhanFind->tiket);
      if($maintenance->count()>0) {
        $maintenance->first()->delete();
      }
      $maintenanceReport = MaintenanceReport::where('keluhan_id',$keluhanFind->tiket);
      if($maintenanceReport->count()>0) {
        $maintenanceReport->first()->delete();
      }
      DB::commit();
      return response()->json(['msg' => 'Successfuly update status', "data" => ['payload' => $payload, 'email' => $dataEmail], 'error' => []], 200);
    } catch (Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'fail update status', "data" => [], 'error' => $e->getMessage()], 500);
    }
  }

  public function select(Request $request)
  {
    $data = [];
    $pro = DB::select('SELECT k.*, p.`nama_pelanggan` FROM keluhans k INNER JOIN pelanggans p ON p.`id` = k.`pelanggan_id`  WHERE k.`status`="0" AND k.`is_aktif`="1"');
    foreach ($pro as $d) {
      array_push($data, [
        'label' => $d->tiket . '|' . $d->nama_pelanggan,
        'value' => $d->tiket
      ]);
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }
  public function selectOnlyId($id)
  {
    $data = [];
    $pro = DB::select('SELECT k.*, p.`nama_pelanggan` FROM keluhans k INNER JOIN pelanggans p ON p.`id` = k.`pelanggan_id`  WHERE k.`is_aktif`="1" AND k.`status`="0" OR k.`tiket`="' . $id . '"');
    foreach ($pro as $d) {
      array_push($data, [
        'label' => $d->tiket . '|' . $d->nama_pelanggan,
        'value' => $d->tiket
      ]);
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function log(Request $request)
  {
    $sql = "SELECT * FROM (
              SELECT logs.created_at, logs.deskripsi, IFNULL(nama_pegawai,(select nama_pelanggan from pelanggans WHERE id=logs.updated_by)) AS 'updated_by' from logs
              INNER join pelanggans on pelanggans.id = logs.user_id
              LEFT join pegawais on pegawais.id = logs.updated_by
              WHERE logs.type = '1' AND logs.`keluhan_id` = '$request->idKeluhan'
              UNION
              SELECT logs.created_at, concat(logs.deskripsi, ' Teknisi yang menangani adalah ', pegawais.`nama_pegawai`),
              IFNULL(up.nama_pegawai,'Sistem') AS 'updated_by' from logs
              INNER join pegawais on pegawais.`id` = logs.user_id
              LEFT join pegawais up on up.id = logs.updated_by
              WHERE logs.type = '2' AND logs.`keluhan_id` = '$request->idKeluhan'
              UNION
              SELECT created_at, deskripsi, IFNULL(nama_pegawai,'Sistem') AS 'updated_by' from(
              SELECT logs.created_at, deskripsi, up.`nama_pegawai` from logs
              INNER join pegawais on pegawais.`id` = logs.user_id
              LEFT join pegawais up on up.`id` = logs.updated_by
              WHERE logs.type = '3' AND logs.`keluhan_id` = '$request->idKeluhan'
              UNION
              SELECT logs.created_at, concat(logs.deskripsi, ' Teknisi baru yang menangani adalah ', pegawais.`nama_pegawai`),
              IFNULL(up.nama_pegawai,'Sistem') AS 'updated_by' from logs
              INNER join pegawais on pegawais.`id` = logs.user_id
              LEFT join pegawais up on up.id = logs.updated_by
              WHERE logs.type = '4' AND logs.`keluhan_id` = '$request->idKeluhan'
              ORDER BY created_at
              ) AS pivot
    ) AS tbfix
    ORDER BY created_at DESC";
    $data = DB::select($sql);
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function sendEmail(Request $request)
  {
    dispatch(new SendMailKeluhan($request->all()));
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
      Excel::import(new KeluhansImport, request()->file('file'));
      DB::commit();
      return response()->json(['msg' => 'Successfuly import data keluhan', "data" => [], 'error' => null], 200);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed created data keluhan', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }
}
