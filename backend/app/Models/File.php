<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
  use HasFactory;
  use Uuid;

  protected $table = 'files';
  protected $guarded = [];
  public $timestamps = false;
  protected $keyType = 'string';
}
