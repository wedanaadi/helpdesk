<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolveReport extends Model
{
  use HasFactory;
  use Uuid;
  protected $table = 'solve_reports';
  protected $guarded = [];
  public $timestamps = false;
  protected $keyType = 'string';

  public function scopeFilter($query, array $filters)
  {
    $query->when($filters['periode'] ?? false, function ($query, $params)  {
      $periode = explode(',',$params);
      return $query->whereRaw("created_at >= '".$periode[0]."' AND created_at < '".$periode[1]."' ");
      // return $query->whereRaw("created_at between '".$periode[0]."' AND '".$periode[1]."' ");
    });
    $query->when($filters['provinsi'] ?? false, function ($query, $params)  {
      return $query->whereHas('keluhan.pelanggan.kelurahan.kecamatan.kabkot.provinsi', function ($query) use ($params) {
          $query->where('id', $params);
        });
    });
    $query->when($filters['kabkot'] ?? false, function ($query, $params)  {
      return $query->whereHas('keluhan.pelanggan.kelurahan.kecamatan.kabkot', function ($query) use ($params) {
          $query->where('id', $params);
        });
    });
    $query->when($filters['kecamatan'] ?? false, function ($query, $params)  {
      return $query->whereHas('keluhan.pelanggan.kelurahan.kecamatan', function ($query) use ($params) {
          $query->where('id', $params);
        });
    });
    $query->when($filters['kelurahan'] ?? false, function ($query, $params)  {
      return $query->whereHas('keluhan.pelanggan.kelurahan', function ($query) use ($params) {
          $query->where('id', $params);
        });
    });
  }

  public function keluhan()
  {
    return $this->belongsTo(Keluhan::class,'keluhan_id','tiket')->orderBy('status','ASC');
  }
}
