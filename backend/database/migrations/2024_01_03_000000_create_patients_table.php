<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->unsignedBigInteger('clinic_id');
            $table->string('full_name');
            $table->string('document_number')->unique();
            $table->enum('document_type', ['CC', 'CE', 'PA', 'PEP'])->default('CC');
            $table->date('birth_date');
            $table->enum('gender', ['M', 'F', 'O'])->nullable();
            $table->string('phone');
            $table->string('email');
            $table->text('address');
            $table->string('city');
            $table->string('state');
            $table->string('postal_code');
            $table->text('allergies')->nullable();
            $table->text('diseases')->nullable();
            $table->text('medications')->nullable();
            $table->text('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->text('medical_history')->nullable();
            $table->decimal('credit_balance', 10, 2)->default(0);
            $table->string('insurance_company')->nullable();
            $table->string('insurance_policy')->nullable();
            $table->date('last_visit')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('clinic_id')->references('id')->on('clinics')->onDelete('cascade');
            $table->index('clinic_id');
            $table->index('document_number');
            $table->index('email');
            $table->index('active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
