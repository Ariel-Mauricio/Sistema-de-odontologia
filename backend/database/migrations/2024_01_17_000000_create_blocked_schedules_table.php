<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blocked_schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('doctor_id');
            $table->unsignedBigInteger('clinic_id');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->string('reason');
            $table->timestamps();
            
            $table->foreign('doctor_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('clinic_id')->references('id')->on('clinics')->onDelete('cascade');
            $table->index(['clinic_id', 'start_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blocked_schedules');
    }
};
