<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\ReportController;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::get('/test', function(){
//   return "Test Api Success";
// });

// Route::post('updateUserLogin', [AuthController::class, 'update_data_login']);
// Route::post('/register', [AuthController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
//! NOTE */ route diatas berjalan ketika tombol login di klik (ini memanggil controller auth dan fuction login)

Route::get('/notifikasi', [AuthController::class, 'notifikasi']);
//! NOTE */ route diatas untuk check notifikasi

Route::post('/sendChat', [AuthController::class, 'save_pesan']);
//! NOTE */ route diatas untuk mengirim email pesan di menu

Route::get('/getNotif', [AuthController::class, 'getData']);
//! NOTE */ route diatas untuk mengecek pesan user login

Route::get('/Notifikasi-isRead', [AuthController::class, 'isReadNotifikasi']);
//! NOTE */ route diatas untuk mengupdate pesan masuk

Route::get('/get-queue', [AuthController::class, 'getQueue']);
//! NOTE */ route diatas untuk mengirim email dari import data

Route::post('/delete-queue', [AuthController::class, 'deleteQueue']);
//! NOTE */ route diatas untuk menghapus data queue yang sudah dikirim

Route::post('import/pelanggan', [PelangganController::class, 'import']);
//! NOTE */ route diatas berjalan ketika tombol import di pelanggan di klik

Route::post('import/keluhan', [ComplaintController::class, 'import']);
//! NOTE */ route diatas berjalan ketika tombol import di keluhan di klik

Route::middleware('auth:sanctum')->group(function () {
  Route::post('logout', [AuthController::class, 'logout']);
  //! NOTE */ route diatas berjalan ketika tombol logout

  Route::post('sendEmail', [AuthController::class, 'sendEmail']);
  //! NOTE */ route diatas untuk send email ke teknisi

  Route::post('sendEmail/pelanggan', [AuthController::class, 'sendEmailPelanggan']);
  //! NOTE */ route diatas untuk send email ke pelanggan

  Route::get('/kategori', [KategoriController::class, 'index']);
  //! NOTE */ route diatas untuk menampilkan data kategori

  Route::post('/kategori', [KategoriController::class, 'store']);
  //! NOTE */ route diatas untuk menambah data kategori

  Route::put('/kategori/{id}', [KategoriController::class, 'update']);
  //! NOTE */ route diatas untuk mengubah data kategori

  Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);
  //! NOTE */ route diatas untuk mengapus data kategori

  Route::get('/pegawai', [PegawaiController::class, 'index']);
  //! NOTE */ route diatas untuk menampilkan data pegawai

  Route::get('/pegawai-profile-data', [PegawaiController::class, 'showPegawai']);
  //! NOTE */ route diatas untuk menampilkan profil pegawai

  Route::post('/pegawai', [PegawaiController::class, 'store']);
  //! NOTE */ route diatas untuk menambah data pegawai

  Route::post('/profile-change-pegawai', [PegawaiController::class, 'changeProfile']);
  //! NOTE */ route diatas untuk mengubah data profil pegawai

  Route::post('/pegawai/sendEmail', [PegawaiController::class, 'sendEmail']);
  //! NOTE */ route diatas untuk mengirim email notifkasi ke pegawai

  Route::put('/pegawai/{id}', [PegawaiController::class, 'update']);
  //! NOTE */ route diatas untuk mengupdate data pegawai

  Route::delete('/pegawai/{id}', [PegawaiController::class, 'destroy']);
  //! NOTE */ route diatas untuk menghapus/mengnonaktifkan pegawai

  Route::get('/pelanggan', [PelangganController::class, 'index']);
  //! NOTE */ route diatas untuk menampilkan data pelanggan

  Route::get('/pelanggan-profile-data', [PelangganController::class, 'showPelanggan']);
  //! NOTE */ route diatas untuk menampilkan profil pelanggan

  Route::post('/pelanggan', [PelangganController::class, 'store']);
  //! NOTE */ route diatas untuk menambah data pelanggan

  Route::post('/profile-change-pelanggan', [PelangganController::class, 'changeProfile']);
  //! NOTE */ route diatas untuk mengubah profil pelanggan

  Route::post('/pelanggan/sendEmail', [PelangganController::class, 'sendEmail']);
  //! NOTE */ route diatas untuk mengirim email notifkasi ke pelanggan

  Route::put('/pelanggan/{id}', [PelangganController::class, 'update']);
  //! NOTE */ route diatas untuk mengubah data pelanggan

  Route::delete('/pelanggan/{id}', [PelangganController::class, 'destroy']);
  //! NOTE */ route diatas untuk menghapus/nonaktifkan pelanggan

  Route::get('/provinsi', [PelangganController::class, 'provinsi']);
  //! NOTE */ route diatas untuk menampilkan data provinsi

  Route::get('/kabkot', [PelangganController::class, 'kabkot']);
  //! NOTE */ route diatas untuk menampilkan data kabupaten/kota

  Route::get('/kecamatan', [PelangganController::class, 'kecamatan']);
  //! NOTE */ route diatas untuk menampilkan data kecamatan

  Route::get('/kelurahan', [PelangganController::class, 'kelurahan']);
  //! NOTE */ route diatas untuk menampilkan data kelurahan

  Route::get('/provinsi-report', [ReportController::class, 'provinsi']);
  //! NOTE */ route diatas untuk menampilkan data provinsi untuk laporan

  Route::get('/kabkot-report', [ReportController::class, 'kabkot']);
  //! NOTE */ route diatas untuk menampilkan data kabupaten/kota untuk laporan

  Route::get('/kecamatan-report', [ReportController::class, 'kecamatan']);
  //! NOTE */ route diatas untuk menampilkan data kecamatan untuk laporan

  Route::get('/kelurahan-report', [ReportController::class, 'kelurahan']);
  //! NOTE */ route diatas untuk menampilkan data keluharan untuk laporan

  Route::get('/kategori-report', [ReportController::class, 'kategori']);
  //! NOTE */ route diatas untuk menampilkan data kategori untuk laporan

  Route::get('/pelanggan-select',[PelangganController::class, 'select']);
  //! NOTE */ route diatas untuk menampilkan data pelanggan di select (dropdown)

  Route::get('/kategori-select',[KategoriController::class, 'select']);
  //! NOTE */ route diatas untuk menampilkan data kategori di select (dropdown)

  Route::get('/teknisi-select',[PegawaiController::class, 'select']);
  //! NOTE */ route diatas untuk menampilkan data teknisi di select (dropdown)

  Route::get('/ticket-select',[ComplaintController::class, 'select']);
  //! NOTE */ route diatas untuk menampilkan data ticket di select (dropdown)

  Route::get('/sender-select',[PegawaiController::class, 'select_sender']);
  //! NOTE */ route diatas untuk menampilkan data sender di select (dropdown)

  Route::get('/ticket-select2/{id}',[ComplaintController::class, 'selectOnlyId']);
  //! NOTE */ route diatas untuk menampilkan data ticket di select (dropdown)

  Route::get('keluhan', [ComplaintController::class, 'index']);
  //! NOTE */ route diatas untuk menampilkan data keluhan

  Route::get('keluhan-notifikasi', [ComplaintController::class, 'notifikasi_keluhan']);
  //! NOTE */ route diatas untuk menampilkan notifikasi keluhan

  Route::get('keluhan-pelanggan', [ComplaintController::class, 'index_pelanggan']);
  //! NOTE */ route diatas untuk menampilkan keluhan untuk pelanggan

  Route::get('list-pelanggan', [ComplaintController::class, 'listPelangganKeluhan']);
  //! NOTE */ route diatas untuk menampilkan daftar pelanggan di keluhan

  Route::get('keluhan/files/{id}', [ComplaintController::class, 'files']);
  //! NOTE */ route diatas untuk menampilkan list file dari keluhan

  Route::get('log-keluhan', [ComplaintController::class, 'log']);
  //! NOTE */ route diatas untuk menampilkan history / tracking keluhan

  // Route::get('track/{id}', [ComplaintController::class, 'track']);
  Route::post('keluhan', [ComplaintController::class, 'store']);
  //! NOTE */ route diatas untuk menambah keluhan baru

  Route::post('keluhan/sendEmail', [ComplaintController::class, 'sendEmail']);
  //! NOTE */ route diatas untuk mengirim email keluhan ke pelanggan

  Route::put('keluhan/{id}', [ComplaintController::class, 'update']);
  //! NOTE */ route diatas untuk mengubah keluhan

  Route::put('keluhan/status/{id}', [ComplaintController::class, 'solve']);
  //! NOTE */ route diatas untuk mengubah status keluhan menjadi solved

  Route::put('keluhan/status-proccess/{id}', [ComplaintController::class, 'onProccess']);
  //! NOTE */ route diatas untuk mengubah status keluhan menjadi ON PROCESS

  Route::delete('keluhan/{id}', [ComplaintController::class, 'destroy']);
  //! NOTE */ route diatas untuk menghapus keluhan

  Route::get('maintenance', [MaintenanceController::class, 'index']);
  //! NOTE */ route diatas untuk menampilkan data maintenance

  Route::get('maintenance-detail', [MaintenanceController::class, 'detail']);
  //! NOTE */ route diatas untuk menampilkan data maintenance detail

  Route::get('logs-email', [MaintenanceController::class, 'logEmailTrack']);
  //! NOTE */ route diatas untuk menampilkan tracking keluhan di maintenance

  Route::post('maintenance', [MaintenanceController::class, 'store']);
  //! NOTE */ route diatas untuk menambah data maintenance

  Route::post('maintenance/sendEmail', [MaintenanceController::class, 'sendEmail']);
  //! NOTE */ route diatas untuk mengirim email notifikasi

  Route::post('maintenance/sendEmail/t', [MaintenanceController::class, 'sendEmailTeknisi']);
  //! NOTE */ route diatas untuk mengirim email ke teknisi

  Route::put('maintenance/{id}', [MaintenanceController::class, 'update']);
  //! NOTE */ route diatas untuk mengubah data maintenance

  Route::put('maintenance/status/{id}', [MaintenanceController::class, 'changeStatus']);
  //! NOTE */ route diatas untuk mengubah status ticket maintenance (solved / pending)

  Route::put('maintenance/expired/{id}', [MaintenanceController::class, 'changeExpiredDate']);
  //! NOTE */ route diatas untuk mengubah expired date ticket maintenance

  Route::put('maintenance/teknisiChange/{id}', [MaintenanceController::class, 'changeTeknisi']);
  //! NOTE */ route diatas untuk mengubah penugasan teknisi dari ticket maintenance

  Route::delete('maintenance/{id}', [MaintenanceController::class, 'destroy']);
  //! NOTE */ route diatas untuk enghapus teknisi maintenance

});

// Route::get('solved-report',[ReportController::class, 'report_solved']);
Route::get('complaint-report',[ReportController::class, 'report_complaint']);
//! NOTE */ route diatas untuk laporan data complaint

Route::get('maintenance-report',[ReportController::class, 'report_maintenance']);
//! NOTE */ route diatas untuk laporan data maintenance

// Route::get('solved-chart',[ReportController::class, 'chart_solved']);
Route::get('complaint-chart',[ReportController::class, 'chart_complaint']);
//! NOTE */ route diatas untuk laporan data grafik complaint

Route::get('maintenance-chart',[ReportController::class, 'chart_maintenance']);
//! NOTE */ route diatas untuk laporan data grafik maintenance

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//   return $request->user();
// });
