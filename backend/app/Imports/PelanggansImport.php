<?php

namespace App\Imports;

use App\Jobs\SendMailCreated;
use App\Libraries\Fungsi;
use App\Models\Pelanggan;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Illuminate\Support\Str;

class PelanggansImport implements WithStartRow, ToCollection
{
  public function startRow(): int
  {
    return 2;
  }

  public function collection(Collection $rows)
  {
    $dataFixed = [];
    foreach ($rows as $row) {
      $date = date('y') . date('m');
      $lastKode = Pelanggan::select(DB::raw('MAX(id) AS kode'))
        ->where(DB::raw('SUBSTR(id,2,4)'), $date)
        ->first();
      $newID = Fungsi::KodeGenerate($lastKode->kode, 5, 6, 'P', $date);

      $provinsi = null;
      $kabkot = null;
      $kecamatan = null;
      $kelurahan = null;

      $idProv = DB::table('provinces')->select('id')->where('name', strtoupper($row[4]));
      if ($idProv->count() > 0) {
        $provinsi = $idProv->first()->id;
      }
      $idKabKot = DB::table('regencies')->select('id')->where('name', strtoupper($row[5]))->where('province_id', $provinsi);
      if ($idKabKot->count() > 0) {
        $kabkot = $idKabKot->first()->id;
      }
      $idKecamatan = DB::table('districts')->select('id')->where('name', strtoupper($row[6]))->where('regency_id', $kabkot);
      if ($idKecamatan->count() > 0) {
        $kecamatan = $idKecamatan->first()->id;
      }
      $idKelurahan = DB::table('villages')->select('id')->where('name', strtoupper($row[7]))->where('district_id', $kecamatan);
      if ($idKelurahan->count() > 0) {
        $kelurahan = $idKelurahan->first()->id;
      }

      if (!is_null($row[0]) and !is_null($provinsi) and !is_null($kabkot) and !is_null($kecamatan) and !is_null($kelurahan)) {
        $kor = explode(', ', $row[8]);
        $data = [
          'id' => $newID,
          'email' => $row[0],
          'nama_pelanggan' => $row[1],
          'alamat' => $row[2],
          'telepon' => $row[3],
          'provinsi' => $provinsi,
          'kabkot' => $kabkot,
          'kecamatan' => $kecamatan,
          'kelurahan' => $kelurahan,
          'lat' => $kor[0],
          'long' => $kor[1],
          'created_at' => round(microtime(true) * 1000),
          'updated_at' => round(microtime(true) * 1000),
        ];
        array_push($dataFixed, $data);
        $cekDB = Pelanggan::where('email', $row[0]);
        if ($cekDB->count() > 0) {
          $cekDB->update($data);
          $dataEmail = [
            'message' => 'Selamat, Akun berhasil diubah!.',
            'subject' => 'Updated Data',
            'username' => $newID,
            'password' => $newID,
            'email' => $row[0],
            'public_url' => 'http://localhost:5173'
          ];
        } else {
          Pelanggan::create($data);
          $dataEmail = [
            'message' => 'Selamat, Akun berhasil dibuat!.',
            'subject' => 'Created Data',
            'username' => $newID,
            'password' => $newID,
            'email' => $row[0],
            'public_url' => 'http://localhost:5173'
          ];
          $payloadUser = [
            'username' => $newID,
            'password' => bcrypt($newID),
            'role' => "4",
            'relasi_id' => $newID,
            'created_at' => round(microtime(true) * 1000),
            'updated_at' => round(microtime(true) * 1000),
          ];
          User::create($payloadUser);
        }
        DB::table('queue_email_jobs')->insert([
          'id' => Str::uuid()->toString(),
          'url' =>"pelanggan/sendEmail",
          'task' => json_encode($dataEmail),
        ]);
        // dispatch(new SendMailCreated($dataEmail));
      }
    }
  }
}
