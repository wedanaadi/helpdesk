<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmailPelangganJob;
use App\Jobs\SendMailJob;
use App\Models\Notif;
use App\Models\Pegawai;
use App\Models\Pelanggan;
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
      if ($user->role == "4") {
        $pelanggan = Pelanggan::find($user->relasi_id);
        $userList = [
          'idUser' => $pelanggan->id,
          'role' => $user->role,
          'relasi' => $pelanggan
        ];
      } else if ($user->role == '5') {
        $userList = [
          'idUser' => "0",
          'role' => $user->role,
          'relasi' => [
            'nama' => 'Super User',
            'Alamat' => 'Super User'
          ]
        ];
      } else {
        $pegawai = Pegawai::find($user->relasi_id);
        $userList = [
          'idUser' => $pegawai->id,
          'role' => $user->role,
          'relasi' => $pegawai
        ];
      }
      $token = $user->createToken('sanctum_token')->plainTextToken;
      $payload = [
        'access_token' => $token,
        'user_data' => $userList
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
    $validator = Validator::make($request->all(), [
      'subject' => 'required',
      'body' => 'required'
    ], [
      'required' => 'Input :attribute harus diisi!'
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    try {
      $data = $request->all();
      dispatch(new SendMailJob($data));
      // return redirect()->route('kirim-email')->with('status', 'Email berhasil dikirim');
      return response()->json(['msg' => 'Successfuly Login', "data" => $data, 'error' => null], 200);
    } catch (\Exception $e) {
      return response()->json(['msg' => 'Failed Login', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function sendEmailPelanggan(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'subject' => 'required',
      'body' => 'required'
    ], [
      'required' => 'Input :attribute harus diisi!'
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    try {
      $data = $request->all();
      dispatch(new SendEmailPelangganJob($data));
      // return redirect()->route('kirim-email')->with('status', 'Email berhasil dikirim');
      return response()->json(['msg' => 'Successfuly Login', "data" => $data, 'error' => null], 200);
    } catch (\Exception $e) {
      return response()->json(['msg' => 'Failed Login', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  public function logout()
  {
    Auth::user()->tokens()->delete();
    return response()->json(['msg' => 'Successfuly Login', "data" => [], 'error' => null], 200);
  }

  public function notifikasi(Request $request)
  {
    $data = Notif::where('receive',$request->id)
    ->with('sender','getter')
    ->where('is_read','0')
    ->get();
    return $data;
  }

  public function getData(Request $request)
  {
    $data = Notif::where('receive',$request->idLogin)
    ->where('send',$request->idPengirim)
    ->with('sender','getter')
    ->where('is_read','0')
    ->orderBy('created_at','DESC')
    ->get();
    return response()->json(['msg' => 'Successfuly Login', "data" => $data, 'error' => null], 200);
  }

  public function save_pesan(Request $request)
  {
    $sql = "SELECT * FROM notifikasi WHERE receive = '$request->pengirim' AND send = '$request->penerima' AND is_read = '0'";
    $prev = DB::select($sql);
    Notif::create([
      'send' => $request->pengirim,
      'receive' => $request->penerima,
      'body' => $request->pesan,
      'created_at' => round(microtime(true) * 1000),
      'updated_at' => round(microtime(true) * 1000),
      'created_user' => $request->pengirim
    ]);

    foreach ($prev as $v) {
      Notif::find($v->id)->update(['is_read'=> '1']);
    }
    return response()->json(['msg' => 'Successfuly Login', "data" => [], 'error' => null], 200);
  }
}
