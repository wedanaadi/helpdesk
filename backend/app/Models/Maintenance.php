<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
  use HasFactory;
  use Uuid;

  protected $table = 'maintenances';
  protected $guarded = [];
  public $timestamps = false;
  protected $keyType = 'string';

  public function scopeFilter($query, array $filters)
  {
    $query->when($filters['search'] ?? false, function ($query, $search) {
      return $query->where('note', 'like', '%' . $search . '%')
        ->orWhere('tiket_keluhan', 'like', '%' . $search . '%')
        ->orWhere('tiket_maintenance', 'like', '%' . $search . '%')
        ->orWhereHas('teknisi', function ($query) use ($search) {
          $query->where('nama_pegawai', $search);
        });
    });
  }
  public function teknisi()
  {
    return $this->belongsTo(Pegawai::class, 'pegawai_id', 'id');
  }

  public function keluhan()
  {
    return $this->belongsTo(Keluhan::class, 'tiket_keluhan', 'tiket');
  }
}
