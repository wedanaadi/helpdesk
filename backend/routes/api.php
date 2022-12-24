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

Route::get('/hello', function () {
  return [0 => ['nama' => 'Adi'], 1 => ['nama' => 'Wedana']];
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('updateUserLogin', [AuthController::class, 'update_data_login']);
Route::post('/register', [AuthController::class, 'store']);

Route::get('/notifikasi', [AuthController::class, 'notifikasi']);
Route::post('/sendChat', [AuthController::class, 'save_pesan']);
Route::get('/getNotif', [AuthController::class, 'getData']);

Route::middleware('auth:sanctum')->group(function () {
  Route::post('logout', [AuthController::class, 'logout']);
  Route::post('sendEmail', [AuthController::class, 'sendEmail']);
  Route::post('sendEmail/pelanggan', [AuthController::class, 'sendEmailPelanggan']);

  Route::get('/kategori', [KategoriController::class, 'index']);
  Route::post('/kategori', [KategoriController::class, 'store']);
  Route::put('/kategori/{id}', [KategoriController::class, 'update']);
  Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);

  Route::get('/pegawai', [PegawaiController::class, 'index']);
  Route::post('/pegawai', [PegawaiController::class, 'store']);
  Route::post('/pegawai/sendEmail', [PegawaiController::class, 'sendEmail']);
  Route::put('/pegawai/{id}', [PegawaiController::class, 'update']);
  Route::delete('/pegawai/{id}', [PegawaiController::class, 'destroy']);

  Route::get('/pelanggan', [PelangganController::class, 'index']);
  Route::post('/pelanggan', [PelangganController::class, 'store']);
  Route::post('/pelanggan/sendEmail', [PelangganController::class, 'sendEmail']);
  Route::put('/pelanggan/{id}', [PelangganController::class, 'update']);
  Route::delete('/pelanggan/{id}', [PelangganController::class, 'destroy']);

  Route::get('/provinsi', [PelangganController::class, 'provinsi']);
  Route::get('/kabkot', [PelangganController::class, 'kabkot']);
  Route::get('/kecamatan', [PelangganController::class, 'kecamatan']);
  Route::get('/kelurahan', [PelangganController::class, 'kelurahan']);
  Route::get('/provinsi-report', [ReportController::class, 'provinsi']);
  Route::get('/kabkot-report', [ReportController::class, 'kabkot']);
  Route::get('/kecamatan-report', [ReportController::class, 'kecamatan']);
  Route::get('/kelurahan-report', [ReportController::class, 'kelurahan']);

  Route::get('/pelanggan-select',[PelangganController::class, 'select']);
  Route::get('/kategori-select',[KategoriController::class, 'select']);
  Route::get('/teknisi-select',[PegawaiController::class, 'select']);
  Route::get('/ticket-select',[ComplaintController::class, 'select']);
  Route::get('/sender-select',[PegawaiController::class, 'select_sender']);
  Route::get('/ticket-select2/{id}',[ComplaintController::class, 'selectOnlyId']);

  Route::get('keluhan', [ComplaintController::class, 'index']);
  Route::get('keluhan-notifikasi', [ComplaintController::class, 'notifikasi_keluhan']);
  Route::get('keluhan-pelanggan', [ComplaintController::class, 'index_pelanggan']);
  Route::get('keluhan/files/{id}', [ComplaintController::class, 'files']);
  Route::get('log-keluhan', [ComplaintController::class, 'log']);
  // Route::get('track/{id}', [ComplaintController::class, 'track']);
  Route::post('keluhan', [ComplaintController::class, 'store']);
  Route::post('keluhan/sendEmail', [ComplaintController::class, 'sendEmail']);
  Route::put('keluhan/{id}', [ComplaintController::class, 'update']);
  Route::put('keluhan/status/{id}', [ComplaintController::class, 'solve']);
  Route::put('keluhan/status-proccess/{id}', [ComplaintController::class, 'onProccess']);
  Route::delete('keluhan/{id}', [ComplaintController::class, 'destroy']);

  Route::get('maintenance', [MaintenanceController::class, 'index']);
  Route::post('maintenance', [MaintenanceController::class, 'store']);
  Route::post('maintenance/sendEmail', [MaintenanceController::class, 'sendEmail']);
  Route::put('maintenance/{id}', [MaintenanceController::class, 'update']);
  Route::put('maintenance/status/{id}', [MaintenanceController::class, 'changeStatus']);
  Route::delete('maintenance/{id}', [MaintenanceController::class, 'destroy']);

});
Route::get('solved-report',[ReportController::class, 'report_solved']);
Route::get('complaint-report',[ReportController::class, 'report_complaint']);
Route::get('maintenance-report',[ReportController::class, 'report_maintenance']);
Route::get('solved-chart',[ReportController::class, 'chart_solved']);
Route::get('complaint-chart',[ReportController::class, 'chart_complaint']);
Route::get('maintenance-chart',[ReportController::class, 'chart_maintenance']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  return $request->user();
});
