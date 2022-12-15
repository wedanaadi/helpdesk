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
}
