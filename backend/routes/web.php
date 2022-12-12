<?php

use App\Http\Controllers\authController;
use App\Mail\SendEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/send-email',function(){
//   $data = [
//       'name' => 'Syahrizal As',
//       'body' => 'Testing Kirim Email di Helpdesk App'
//   ];

//   Mail::to('wedanarpl@gmail.com')->send(new SendEmail($data));

//   dd("Email Berhasil dikirim.");
// });

Route::get('/send-email', [authController::class, 'index'])->name('kirim-email');

Route::post('/post-email', [authController::class, 'sendEmail'])->name('post-email');

Route::get('/', function () {
    return view('welcome');
});
