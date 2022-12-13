<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\PelangganController;
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
Route::post('/register', [AuthController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
  Route::post('/logout', [AuthController::class, 'logout']);

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
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  return $request->user();
});
