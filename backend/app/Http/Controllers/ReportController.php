<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Models\MaintenanceReport;
use App\Models\SolveReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
  public function provinsi(Request $request)
  {
    $pro = DB::select('SELECT * FROM provinces');
    $data = [];
    array_push($data, [
      'label' => 'SEMUA',
      'value' => 'all'
    ]);
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
    array_push($data, [
      'label' => 'SEMUA',
      'value' => 'all'
    ]);
    if ($request->provId != 'all') {
      $kabkot = DB::select("SELECT * FROM regencies WHERE province_id = '$request->provId'");
    } else {
      $kabkot = DB::select("SELECT * FROM regencies");
    }
    foreach ($kabkot as $d) {
      array_push($data, [
        'label' => $d->name,
        'value' => $d->id
      ]);
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function kecamatan(Request $request)
  {
    $data = [];
    array_push($data, [
      'label' => 'SEMUA',
      'value' => 'all'
    ]);
    if ($request->regId != 'all') {
      $kabkot = DB::select("SELECT * FROM districts WHERE regency_id = '$request->regId'");
    } else {
      $kabkot = DB::select("SELECT * FROM districts");
    }
    foreach ($kabkot as $d) {
      array_push($data, [
        'label' => $d->name,
        'value' => $d->id
      ]);
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function kelurahan(Request $request)
  {
    $data = [];
    array_push($data, [
      'label' => 'SEMUA',
      'value' => 'all'
    ]);
    if ($request->discId != 'all') {
      $kabkot = DB::select("SELECT * FROM villages WHERE district_id = '$request->discId'");
    } else {
      $kabkot = DB::select("SELECT * FROM villages");
    }
    foreach ($kabkot as $d) {
      array_push($data, [
        'label' => $d->name,
        'value' => $d->id
      ]);
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function report_solved()
  {
    $data = SolveReport::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan']))
      ->with(
        'keluhan',
        'keluhan.kategori',
        'keluhan.pelanggan',
        'keluhan.pelanggan.kelurahan',
        'keluhan.pelanggan.kelurahan.kecamatan',
        'keluhan.pelanggan.kelurahan.kecamatan.kabkot',
        'keluhan.pelanggan.kelurahan.kecamatan.kabkot.provinsi'
      )
      ->paginate(request('perpage'));
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  public function report_maintenance()
  {
    $pending = Maintenance::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan']))
      ->filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan']))
      ->select(
        DB::raw('tiket_keluhan as keluhan_id'),
        'created_at',
        'status',
        DB::raw('"maintenance_tb" as type'),
        DB::raw('IF(status="1","SOLVED","PENDING") as status_desc')
      )
      ->where('status', '!=', '1');
    $data = MaintenanceReport::union($pending)
      ->filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan']))
      ->with(
        'keluhan',
        'keluhan.kategori',
        'keluhan.pelanggan',
        'keluhan.pelanggan.kelurahan',
        'keluhan.pelanggan.kelurahan.kecamatan',
        'keluhan.pelanggan.kelurahan.kecamatan.kabkot',
        'keluhan.pelanggan.kelurahan.kecamatan.kabkot.provinsi'
      )
      ->select(
        'keluhan_id',
        'created_at',
        'status',
        DB::raw('"table_report" as type'),
        DB::raw('IF(status="1","SOLVED","PENDING") as status_desc')
      )
      ->orderBy('status', 'DESC')
      ->paginate(request('perpage'));
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }
}
