<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('treatment_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('treatment_plan_id');
            $table->string('treatment_name');
            $table->text('description')->nullable();
            $table->integer('tooth_number')->nullable();
            $table->enum('tooth_status', ['healthy', 'caries', 'restoration', 'crown', 'implant', 'extraction', 'prosthesis', 'endodontics'])->nullable();
            $table->decimal('cost', 10, 2);
            $table->enum('status', ['pending', 'in_process', 'completed', 'cancelled'])->default('pending');
            $table->date('planned_date')->nullable();
            $table->date('completed_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->foreign('treatment_plan_id')->references('id')->on('treatment_plans')->onDelete('cascade');
            $table->index('treatment_plan_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treatment_items');
    }
};
