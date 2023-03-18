<?php

namespace App\Imports;

use App\Jobs\SendMailKeluhan;
use App\Libraries\Fungsi;
use App\Models\Kategori;
use App\Models\Keluhan;
use App\Models\Log;
use App\Models\Pegawai;
use App\Models\Pelanggan;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Illuminate\Support\Str;

class KeluhansImport implements WithStartRow, ToCollection
{
  public function startRow(): int
  {
    return 2;
  }

  public function collection(Collection $rows)
  {
    $dataFixed = [];
    $kategori = null;
    $userLogin = null;
    foreach ($rows as $row) {
      $idKategori = Kategori::where('nama_kategori',$row[0]);
      if ($idKategori->count() > 0) {
        $kategori = $idKategori->first()->id;
      }
      $idUser = Pegawai::where('nama_pegawai',$row[4]);
      if ($idUser->count() > 0) {
        $userLogin = $idUser->first()->id;
      }
      $prevTicket = Keluhan::where('kategori_id', $kategori)
        ->where('pelanggan_id', $row[2])
        ->where('is_aktif', "1")
        ->where('status', '!=', "1");
      if ($prevTicket->count() > 0) {
        $newTiket = $prevTicket->first()->tiket;
      } else {
        $date = date('y') . date('m');
        $lastKode = Keluhan::select(DB::raw('MAX(tiket) AS kode'))
          ->where(DB::raw('SUBSTR(tiket,2,4)'), $date)
          ->first();
        $newTiket = Fungsi::KodeGenerate($lastKode->kode, 5, 6, 'K', $date);
      }
      if (!is_null($row[0]) and !is_null($kategori)) {
        $data = [
          'id' => Str::uuid()->toString(),
          'kategori_id' => $kategori,
          'pelanggan_id' => $row[2],
          'comment' => $row[3],
          'status' => 0,
          'tiket' => $newTiket,
          'created_user' => $userLogin,
          'updated_user' => $userLogin,
          'expired_date' => strtotime(date("Y-m-d H:i:s") . "+3 days") * 1000,
          'created_at' => round(microtime(true) * 1000),
          'updated_at' => round(microtime(true) * 1000),
        ];
        $dataLog = [
          'keluhan_id' => $newTiket,
          'relasi_log' => $newTiket,
          'type' => '1',
          'user_id' => $row[2],
          'created_at' => round(microtime(true) * 1000),
          'updated_at' => round(microtime(true) * 1000),
          'updated_by' => $userLogin,
        ];

        $pelanggan = Pelanggan::find($row[2]);
        $dataEmail = [
          'message' => ['Selamat, Ticket Keluhan Telah dibuat!.'],
          'nomor' => $newTiket,
          'kategori' => $idKategori->first()->nama_kategori,
          'email' => $pelanggan->email,
        ];

        if ($prevTicket->count() > 0) {
          $prevTicket->update($data);
          $dataLog['deskripsi'] = 'Ticket Keluhan di updated.';
          $dataEmail['subject'] = 'Updated Ticket Complaint';
        } else {
          Keluhan::create($data);
          $dataEmail['subject'] = 'Created Ticket Complaint';
          $dataLog['deskripsi'] = 'Ticket Keluhan di buat.';
        }
        Log::create($dataLog);
        DB::table('queue_email_jobs')->insert([
          'id' => Str::uuid()->toString(),
          'url' =>"keluhan/sendEmail",
          'task' => json_encode($dataEmail),
        ]);
        // dispatch(new SendMailKeluhan($dataEmail));
      }
    }
  }
}
