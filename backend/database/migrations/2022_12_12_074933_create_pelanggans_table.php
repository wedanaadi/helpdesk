<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pelanggans', function (Blueprint $table) {
          $table->uuid('id')->primary();
          $table->string('email')->unique();
          $table->string('nama_pelanggan');
          $table->string('alamat');
          $table->string('telepon',50);
          $table->string('lat');
          $table->string('long');
          $table->string('provinsi');
          $table->string('kabkot');
          $table->string('kecamatan');
          $table->string('kelurahan');
          $table->integer('is_aktif')->default(1);
          $table->bigInteger('created_at');
          $table->bigInteger('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pelanggans');
    }
};
