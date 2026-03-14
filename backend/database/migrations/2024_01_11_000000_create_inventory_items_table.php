<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('clinic_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category');
            $table->string('sku')->unique();
            $table->integer('quantity');
            $table->integer('minimum_stock');
            $table->string('unit');
            $table->decimal('unit_cost', 10, 2);
            $table->string('supplier')->nullable();
            $table->date('expiry_date')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('clinic_id')->references('id')->on('clinics')->onDelete('cascade');
            $table->index('clinic_id');
            $table->index('category');
            $table->index('sku');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
