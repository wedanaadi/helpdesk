<?php

namespace App\Models;

// use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelanggan extends Model
{
  use HasFactory;
  // use Uuid;

  protected $table = 'pelanggans';
  protected $guarded = [];
  public $timestamps = false;
  protected $keyType = 'string';
  // protected $primaryKey = 'id';

  public function scopeFilter($query, array $filters)
  {
    $query->when($filters['search'] ?? false, function ($query, $search) {
      return $query->where('nama_pelanggan', 'like', '%' . $search . '%')
        ->orWhere('email', 'like', '%' . $search . '%')
        ->orWhere('telepon', 'like', '%' . $search . '%')
        ->orWhere('alamat', 'like', '%' . $search . '%')
        ->orWhereHas('kelurahan', function ($query) use ($search) {
          $query->where('name', $search);
        })
        ->orWhereHas('kelurahan.kecamatan', function ($query) use ($search) {
          $query->where('name', $search);
        })
        ->orWhereHas('kelurahan.kecamatan.kabkot', function ($query) use ($search) {
          $query->where('name', $search);
        })
        ->orWhereHas('kelurahan.kecamatan.kabkot.provinsi', function ($query) use ($search) {
          $query->where('name', $search);
        });
    });
    // filter on relasi
    // $query->when($filters['search'] ?? false, function($query, $kelurahan){
    //   return $query->whereHas('kelurahan', function($query) use ($kelurahan) {
    //     $query->where('name',$kelurahan);
    //   });
    // });
  }

  public function kelurahan()
  {
    return $this->belongsTo(Kelurahan::class, 'kelurahan', 'id');
  }
}
