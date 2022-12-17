<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notif extends Model
{
  use HasFactory;
  use Uuid;

  protected $table = 'notifikasi';
  protected $guarded = [];
  public $timestamps = false;
  protected $keyType = 'string';

  public function sender()
  {
    return $this->belongsTo(Pegawai::class,'send' ,'id');
  }
  public function getter()
  {
    return $this->belongsTo(Pegawai::class, 'receive','id');
  }
}
