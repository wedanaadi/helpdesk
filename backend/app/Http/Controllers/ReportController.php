<?php

namespace App\Http\Controllers;

use App\Models\Keluhan;
use App\Models\Maintenance;
use App\Models\MaintenanceReport;
use App\Models\SolveReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
   // ! NOTE: Kode untuk menampilan provinsi
  public function provinsi(Request $request)
  {
    $pro = DB::select('SELECT * FROM provinces WHERE id="51"');
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

   // ! NOTE: Kode untuk menampilkan kabupaten/kota
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

   // ! NOTE: Kode untuk menampilkan kecamatan
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

   // ! NOTE: Kode untuk menampilkan kelurahan
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

   // ! NOTE: Kode untuk menampilkan kategori
  public function kategori(Request $request)
  {
    $pro = DB::select('SELECT * FROM kategoris WHERE is_aktif="1"');
    $data = [];
    array_push($data, [
      'label' => 'SEMUA',
      'value' => 'all'
    ]);
    foreach ($pro as $d) {
      array_push($data, [
        'label' => $d->nama_kategori,
        'value' => $d->id
      ]);
    }
    return response()->json(['msg' => 'Get Kategori', "data" => $data, 'error' => []], 200);
  }

   // ! NOTE: Kode untuk menampilkan laporan keluhan
  public function report_complaint()
  {
    $data = Keluhan::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan', 'kategori']))
      ->leftJoin('maintenance_reports', 'keluhan_id', '=', 'tiket')
      ->with(
        'kategori',
        'pegawai',
        'pelanggan',
        'pelanggan.kelurahan',
        'pelanggan.kelurahan.kecamatan',
        'pelanggan.kelurahan.kecamatan.kabkot',
        'pelanggan.kelurahan.kecamatan.kabkot.provinsi'
      )
      ->whereRaw('keluhan_id IS NULL')
      ->select('keluhans.*', 'maintenance_reports.keluhan_id', DB::raw('IF(keluhans.status = "0","ON",IF(keluhans.status = "1","SOLVED","ON PROCCESS")) AS status_desc'))
      ->orderBy('keluhans.created_at', 'ASC')
      ->paginate(request('perpage'));
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  // public function report_solved()
  // {
  //   $data = SolveReport::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan']))
  //     ->with(
  //       'keluhan',
  //       'keluhan.kategori',
  //       'keluhan.pelanggan',
  //       'keluhan.pelanggan.kelurahan',
  //       'keluhan.pelanggan.kelurahan.kecamatan',
  //       'keluhan.pelanggan.kelurahan.kecamatan.kabkot',
  //       'keluhan.pelanggan.kelurahan.kecamatan.kabkot.provinsi'
  //     )
  //     ->orderBy('created_at', 'ASC')
  //     ->paginate(request('perpage'));
  //   return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  // }

   // ! NOTE: Kode untuk menampilkan laporan maintenance
  public function report_maintenance()
  {
    $pending = Maintenance::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan', 'kategori']))
      ->select(
        DB::raw('tiket_keluhan as keluhan_id'),
        'created_at',
        'status',
        DB::raw('"maintenance_tb" as type'),
        DB::raw('IF(status="1","SOLVED",IF(status="2","PENDING","ON")) as status_desc')
      )
      ->where('status', '!=', '1');
    $data = MaintenanceReport::union($pending)
      ->where('status', '1')
      ->filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan', 'kategori']))
      ->with(
        'keluhan',
        'keluhan.kategori',
        'keluhan.pegawai',
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
        DB::raw('IF(status="1","SOLVED",IF(status="2","PENDING","ON")) as status_desc')
      )
      ->orderBy('status', 'DESC')
      ->paginate(request('perpage'));
    return response()->json(['msg' => 'Get pegawais', "data" => $data, 'error' => []], 200);
  }

  // public function chart_solved()
  // {
  //   // return SolveReport::select('*',DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'),DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'))->get();
  //   $data = SolveReport::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan']))
  //     ->with(
  //       'keluhan',
  //       'keluhan.kategori',
  //       'keluhan.pelanggan',
  //       'keluhan.pelanggan.kelurahan',
  //       'keluhan.pelanggan.kelurahan.kecamatan',
  //       'keluhan.pelanggan.kelurahan.kecamatan.kabkot',
  //       'keluhan.pelanggan.kelurahan.kecamatan.kabkot.provinsi'
  //     );
  //   if (request('type') == "1") {
  //     $data->select(DB::raw('"day" as type'), DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) label'), DB::raw('count(id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day'));
  //     $data->groupBy('month', 'day');
  //   } else if (request('type') == "2") {
  //     $data->select(DB::raw('"month" as type'), DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) label'), DB::raw('count(id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day'));
  //     $data->groupBy('year', 'month');
  //   } else {
  //     $data->select(DB::raw('"day" as type'), DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) label'), DB::raw('count(id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day'));
  //     $data->groupBy('day');
  //   }
  //   return response()->json(['msg' => 'Get pegawais', "data" => $data->get(), 'error' => []], 200);
  // }

  // public function chart_complaint2()
  // {
    //   $data = Keluhan::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan']))
  //     ->leftJoin('maintenance_reports', 'keluhan_id', '=', 'tiket')
  //     ->with(
    //       'kategori',
    //       'pelanggan',
    //       'pelanggan.kelurahan',
    //       'pelanggan.kelurahan.kecamatan',
    //       'pelanggan.kelurahan.kecamatan.kabkot',
    //       'pelanggan.kelurahan.kecamatan.kabkot.provinsi'
    //     )
    //     ->whereRaw('keluhan_id IS NULL')
    //     ->select('keluhans.*', 'maintenance_reports.keluhan_id', DB::raw('IF(keluhans.status = "0","ON",IF(keluhans.status = "1","SOLVED","ON PROCCESS")) AS status_desc'));
    //   if (request('type') == "1") {
      //     $data->select('kategori_id', DB::raw('"day" as type'), DB::raw('DAY(FROM_UNIXTIME(keluhans.created_at/1000)) label'), DB::raw('count(keluhans.id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(keluhans.created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(keluhans.created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(keluhans.created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(keluhans.created_at/1000)) day'));
      //     $data->groupBy('month', 'day','kategori_id');
      //   } else if (request('type') == "2") {
        //     $data->select('kategori_id', DB::raw('"month" as type'), DB::raw('MONTH(FROM_UNIXTIME(keluhans.created_at/1000)) label'), DB::raw('count(keluhans.id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(keluhans.created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(keluhans.created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(keluhans.created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(keluhans.created_at/1000)) day'));
        //     // $data->select(DB::raw('"month" as type'), DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) label'), DB::raw('count(id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day'));
        //     $data->groupBy('year', 'month','kategori_id');
        //   } else {
          //     $data->select('kategori_id', DB::raw('"day" as type'), DB::raw('DAY(FROM_UNIXTIME(keluhans.created_at/1000)) label'), DB::raw('count(keluhans.id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(keluhans.created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(keluhans.created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(keluhans.created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(keluhans.created_at/1000)) day'));
          //     // $data->select(DB::raw('"day" as type'), DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) label'), DB::raw('count(id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day'));
          //     $data->groupBy('day','kategori_id');
          //   }
          //   return $data->get();
          //   return response()->json(['msg' => 'Get pegawais', "data" => $data->get(), 'error' => []], 200);
          // }


  // ! NOTE: Kode untuk menampilkan grafik keluhan
  public function chart_complaint()
  {
    $data = Keluhan::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan','kategori']))
      ->leftJoin('maintenance_reports', 'keluhan_id', '=', 'tiket')
      ->with(
        'pelanggan',
        'pelanggan.kelurahan',
        'pelanggan.kelurahan.kecamatan',
        'pelanggan.kelurahan.kecamatan.kabkot',
        'pelanggan.kelurahan.kecamatan.kabkot.provinsi'
      )
      ->whereRaw('keluhan_id IS NULL')
      ->select('keluhans.*', 'maintenance_reports.keluhan_id', DB::raw('IF(keluhans.status = "0","ON",IF(keluhans.status = "1","SOLVED","ON PROCCESS")) AS status_desc'));

    if (request('type') == "1") {
      $data->select(DB::raw('"day" as type'), DB::raw('DAY(FROM_UNIXTIME(keluhans.created_at/1000)) label'), DB::raw('count(keluhans.id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(keluhans.created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(keluhans.created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(keluhans.created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(keluhans.created_at/1000)) day'));
      $data->groupBy('month', 'day');
    } else if (request('type') == "2") {
      $data->select(DB::raw('"month" as type'), DB::raw('MONTH(FROM_UNIXTIME(keluhans.created_at/1000)) label'), DB::raw('count(keluhans.id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(keluhans.created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(keluhans.created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(keluhans.created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(keluhans.created_at/1000)) day'));
      // $data->select(DB::raw('"month" as type'), DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) label'), DB::raw('count(id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day'));
      $data->groupBy('year', 'month');
    } else {
      $data->select(DB::raw('"day" as type'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(keluhans.created_at/1000),"%Y-%m-%d") label'), DB::raw('count(keluhans.id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(keluhans.created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(keluhans.created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(keluhans.created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(keluhans.created_at/1000)) day'));
      // $data->select(DB::raw('"day" as type'), DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) label'), DB::raw('count(id) as jumlah'), DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'), DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'), DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'), DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day'));
      $data->groupBy('day','year', 'month');
    }
    return response()->json(['msg' => 'Get pegawais', "data" => $data->get(), 'error' => []], 200);
  }

   // ! NOTE: Kode untuk menampilkan grafik maintenance
  public function chart_maintenance()
  {
    $pending = Maintenance::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan','kategori']));
    $pending->where('status', '!=', '1');
    if (request('type') == '2') {
      $pending->select(
        DB::raw("tiket_keluhan AS id_ticket"),
        'status',
        DB::raw('"month" as type'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) label'),
        DB::raw('count(id) as jumlah'),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'),
        DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day')
      );
    } else {
      $pending->select(
        DB::raw("tiket_keluhan AS id_ticket"),
        'status',
        DB::raw('"day" as type'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) label'),
        DB::raw('count(id) as jumlah'),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'),
        DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day')
      );
    }

    $report = MaintenanceReport::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan','kategori']))
      ->where('status', '1');

    if (request('type') == '2') {
      $report->select(
        DB::raw("keluhan_id AS id_ticket"),
        'status',
        DB::raw('"month" as type'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) label'),
        DB::raw('count(id) as jumlah'),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'),
        DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day')
      )
      ->groupBy(
        DB::raw("YEAR(FROM_UNIXTIME(created_at/1000))"),
      );
    } else if (request('type') == '1') {
      $report->select(
        DB::raw("keluhan_id AS id_ticket"),
        'status',
        DB::raw('"day" as type'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) label'),
        DB::raw('count(id) as jumlah'),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'),
        DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day')
      )
      ->groupBy(
        DB::raw("DAY(FROM_UNIXTIME(created_at/1000))"),
        DB::raw("MONTH(FROM_UNIXTIME(created_at/1000))"),
      );
    } else {
      $report->select(
        DB::raw("keluhan_id AS id_ticket"),
        'status',
        DB::raw('"day" as type'),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") label'),
        DB::raw('count(id) as jumlah'),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'),
        DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day')
      )
      ->groupBy(
        DB::raw("DAY(FROM_UNIXTIME(created_at/1000))"),
        DB::raw("MONTH(FROM_UNIXTIME(created_at/1000))"),
        DB::raw("YEAR(FROM_UNIXTIME(created_at/1000))"),
      );
    }
    $report->union($pending);
    $data = DB::table(DB::raw("({$report->toSql()}) as sub"))
      ->mergeBindings($report->getQuery());
    if (request('type') == "1") {
      $data->select('*', DB::raw('sum(jumlah) as jumlah'));
      $data->groupBy('month','day');
    } else if (request('type') == "2") {
      $data->select('*', DB::raw('sum(jumlah) as jumlah'));
      $data->groupBy('month', 'year');
    } else {
      $data->select('*', DB::raw('sum(jumlah) as jumlah'));
      $data->groupBy('day','month', 'year');
    }
    $data->orderBy('format_date','ASC');
    return response()->json(['msg' => 'Get pegawais', "data" => $data->get(), 'error' => []], 200);
  }

  public function chart_maintenance_2()
  {
    return $pending = Maintenance::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan']));
    $pending->with(
      'keluhans',
      'keluhans.kategori',
      'keluhans.pelanggan',
      'keluhans.pelanggan.kelurahan',
      'keluhans.pelanggan.kelurahan.kecamatan',
      'keluhans.pelanggan.kelurahan.kecamatan.kabkot',
      'keluhans.pelanggan.kelurahan.kecamatan.kabkot.provinsi'
    );
    if (request('type') === '2') {
      $pending->select(
        'id',
        'status',
        DB::raw('"month" as type'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) label'),
        DB::raw('count(id) as jumlah'),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'),
        DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day')
      );
    } else {
      $pending->select(
        'id',
        'status',
        DB::raw('"day" as type'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) label'),
        DB::raw('count(id) as jumlah'),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'),
        DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day')
      );
    }
    $pending->where('status', '=', '2')->get();

    return $mentah = MaintenanceReport::filter(request(['periode', 'provinsi', 'kabkot', 'kecamatan', 'kelurahan']))
      ->union($pending)
      ->with(
        'keluhan',
        'keluhan.kategori',
        'keluhan.pelanggan',
        'keluhan.pelanggan.kelurahan',
        'keluhan.pelanggan.kelurahan.kecamatan',
        'keluhan.pelanggan.kelurahan.kecamatan.kabkot',
        'keluhan.pelanggan.kelurahan.kecamatan.kabkot.provinsi'
      );
    if (request('type') == "1") {
      $mentah->select(
        'id',
        'status',
        DB::raw('"day" as type'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) label'),
        DB::raw('count(id) as jumlah'),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'),
        DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day')
      );
      $mentah->groupBy('month', 'day');
    } else if (request('type') == "2") {
      $mentah->select(
        'id',
        'status',
        DB::raw('"month" as type'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) label'),
        DB::raw('count(id) as jumlah'),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'),
        DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day')
      );
      $mentah->groupBy('year', 'month');
    } else {
      $mentah->select(
        'id',
        'status',
        DB::raw('"day" as type'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) label'),
        DB::raw('count(id) as jumlah'),
        DB::raw('DATE_FORMAT(FROM_UNIXTIME(created_at/1000),"%Y-%m-%d") as format_date'),
        DB::raw('YEAR(FROM_UNIXTIME(created_at/1000)) year'),
        DB::raw('MONTH(FROM_UNIXTIME(created_at/1000)) month'),
        DB::raw('DAY(FROM_UNIXTIME(created_at/1000)) day')
      );
      $mentah->groupBy('day');
    }
    $data = DB::table(DB::raw("({$mentah->toSql()}) as sub"))
      ->mergeBindings($mentah->getQuery());
    if (request('type') == "1") {
      $data->select('*', DB::raw('count(jumlah) as jumlah'));
      $data->groupBy('day');
    } else if (request('type') == "2") {
      $data->select('*', DB::raw('count(jumlah) as jumlah'));
    } else {
      $data->select('*', DB::raw('count(jumlah) as jumlah'));
      $data->groupBy('day');
    }

    return response()->json(['msg' => 'Get pegawais', "data" => $data->get(), 'error' => []], 200);
    // return $data->get();
  }
}
