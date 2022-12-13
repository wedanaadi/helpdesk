<?php

namespace App\Models;

// use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
  use HasFactory;
  // use Uuid;

  protected $table = 'pegawais';

  protected $guarded = [];
  public $incrementing = false;
  public $timestamps = false;
  protected $keyType = 'string';
  // protected $primaryKey = 'id';

  public function scopeFilter($query, array $filters)
  {
    $query->when($filters['search'] ?? false, function ($query, $search) {
      return $query->where('nama_pegawai', 'like', '%' . $search . '%')
            ->orWhere('email', 'like', '%' . $search . '%')
            ->orWhere('telepon', 'like', '%' . $search . '%')
            ->orWhere('alamat', 'like', '%' . $search . '%');
    });
    // filter on relasi
    // $query->when($filters['category'] ?? false, function($query, $category){
    //   return $query->whereHas('category', function($query) use ($category) {
    //     $query->where('field relasi',$category);
    //   });
    // });
  }

  public function user()
  {
    return $this->belongsTo(User::class, 'id','relasi_id');
  }
}
