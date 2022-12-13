<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
  use HasFactory;
  protected $table = 'districts';
  protected $guarded = [];
  public $timestamps = false;
  protected $keyType = 'string';
  // protected $primaryKey = 'id';

  public function kabkot()
  {
    return $this->belongsTo(KabKot::class, 'regency_id','id');
  }
}
