<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
  use HasFactory;
  use Uuid;

  protected $table = 'kategoris';
  protected $guarded = [];
  public $timestamps = false;
  protected $keyType = 'string';
  // protected $primaryKey = 'id';

  public function scopeFilter($query, array $filters)
  {
    $query->when($filters['search'] ?? false, function($query, $search){
      return $query->where('nama_kategori', 'like', '%' . $search . '%');
    });
    // filter on relasi
    // $query->when($filters['category'] ?? false, function($query, $category){
    //   return $query->whereHas('category', function($query) use ($category) {
    //     $query->where('field relasi',$category);
    //   });
    // });
  }
}
