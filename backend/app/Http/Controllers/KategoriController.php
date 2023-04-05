<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class KategoriController extends Controller
{
  // ! NOTE : Kode untuk menampilkan data kategori
  public function index()
  {
    $data = Kategori::filter(request(['search']))
      ->where('is_aktif',"1")
      ->OrderBy('nama_kategori', 'ASC')
      ->paginate(request('perpage'));
    return response()->json(['msg' => 'Get kategoris', "data" => $data, 'error' => []], 200);
  }

  // ! NOTE : Kode untuk menampilkan kategori di dropdown
  public function select(Request $request)
  {
    $pro = DB::select('SELECT * FROM kategoris');
    $data = [];
    foreach ($pro as $d) {
      array_push($data, [
        'label' => $d->nama_kategori,
        'value' => $d->id
      ]);
    }
    return response()->json(['msg' => 'Get kategoris', "data" => $data, 'error' => []], 200);
  }

  // ! NOTE : Kode untuk menambah data baru
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'nama_kategori' => 'required'
    ], [
      'required' => 'Input :attribute harus diisi!'
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    DB::beginTransaction();
    try {
      $payload = [
        'nama_kategori' => $request->nama_kategori,
        'created_at' => round(microtime(true) * 1000),
        'updated_at' => round(microtime(true) * 1000),
      ];
      Kategori::create($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly created data Kategori', "data" => $payload, 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed created data Kategori', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE : Kode untuk mengubah data baru
  public function update(Request $request, $id)
  {
    $validator = Validator::make($request->all(), [
      'nama_kategori' => 'required'
    ], [
      'required' => 'Input :attribute harus diisi!'
    ]);

    if ($validator->fails()) {
      return response()->json(['msg' => 'Validasi Error', "data" => null, 'errors' => $validator->messages()->toArray()], 422);
    }

    $find = Kategori::find($id);
    DB::beginTransaction();
    try {
      $payload = [
        'nama_kategori' => $request->nama_kategori,
        'updated_at' => round(microtime(true) * 1000),
      ];
      $find->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly update data Kategori', "data" => $payload, 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed update data Kategori', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }

  // ! NOTE : Kode untuk menghapus data
  public function destroy($id)
  {
    $find = Kategori::find($id);
    DB::beginTransaction();
    try {
      $payload = [
        'is_aktif' => "0",
        'updated_at' => round(microtime(true) * 1000),
      ];
      $find->update($payload);
      DB::commit();
      return response()->json(['msg' => 'Successfuly update data delete', "data" => $payload, 'error' => null], 201);
    } catch (\Exception $e) {
      DB::rollBack();
      return response()->json(['msg' => 'Failed update data delete', "data" => null, 'error' => $e->getMessage()], 500);
    }
  }
}
