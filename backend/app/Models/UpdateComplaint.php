<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UpdateComplaint extends Model
{
  use HasFactory;
  use Uuid;
  protected $table = 'update_desc_reports';
  protected $guarded = [];
  public $timestamps = false;
  protected $keyType = 'string';
}
