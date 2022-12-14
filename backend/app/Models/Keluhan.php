<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keluhan extends Model
{
  use HasFactory;
  use Uuid;

  protected $table = 'keluhans';
  protected $guarded = [];
  public $timestamps = false;
  protected $keyType = 'string';

  public function scopeFilter($query, array $filters)
  {
    $query->when($filters['search'] ?? false, function ($query, $search) {
      return $query->where('tiket', 'like', '%' . $search . '%')
        // ->where('comment', 'like', '%' . $search . '%')
        ->orWhereHas('pelanggan', function ($query) use ($search) {
          $query->where('nama_pelanggan', $search);
        })
        ->orWhereHas('kategori', function ($query) use ($search) {
          $query->where('nama_kategori', $search);
        });
    });
  }

  public function pelanggan()
  {
    return $this->belongsTo(Pelanggan::class, 'pelanggan_id', 'id');
  }

  public function kategori()
  {
    return $this->belongsTo(Kategori::class, 'kategori_id', 'id');
  }

  public function files()
  {
    return $this->hasMany(File::class, 'keluhan_id','tiket');
  }
}
