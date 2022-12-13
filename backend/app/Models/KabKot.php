<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KabKot extends Model
{
  use HasFactory;
  protected $table = 'regencies';
  protected $guarded = [];
  public $timestamps = false;
  protected $keyType = 'string';
  // protected $primaryKey = 'id';

  public function provinsi()
  {
    return $this->belongsTo(Provinsi::class, 'province_id','id');
  }
}
