<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceReport extends Model
{
    use HasFactory;
    use Uuid;
    protected $table = 'maintenance_reports';
    protected $guarded = [];
    public $timestamps = false;
    protected $keyType = 'string';
}
