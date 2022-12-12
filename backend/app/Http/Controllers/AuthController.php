<?php

namespace App\Http\Controllers;

use App\Jobs\SendMailJob;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
  public function login(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'username' => 'required',
      'password' => 'required'
    ], [
      'required' => 'Input :attribute harus diisi!'
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    try {
      $user = User::firstWhere('username', $request->username);
      if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['errors' => 'Bad Credentials'], 403);
      }
      $token = $user->createToken('sanctum_token')->plainTextToken;
      $payload = [
        'access_token' => $token
      ];
      return response()->json(['msg' => 'Successfuly Login', "data" => $payload, 'error' => null], 200);
    } catch (\Exception $e) {
      return response()->json(['msg' => 'Failed Login', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function store()
  {
    User::create([
      'username' => 'test',
      'password' => bcrypt('test'),
      'role' => "1",
      'relasi_id' => "0",
      'created_at' => round(microtime(true) * 1000),
      'updated_at' => round(microtime(true) * 1000),
    ]);
    return response()->json([
      'message' => 'Successfuly logged in',
    ], 201);
  }

  public function index()
  {
    return view('kirim-email');
  }

  public function sendEmail(Request $request)
  {
    $data = $request->all();

    dispatch(new SendMailJob($data));
    return redirect()->route('kirim-email')->with('status', 'Email berhasil dikirim');
  }

  public function logout()
  {
    Auth::user()->tokens()->delete();
    return response()->json(['msg' => 'Successfuly Login', "data" => [], 'error' => null], 200);
  }
}