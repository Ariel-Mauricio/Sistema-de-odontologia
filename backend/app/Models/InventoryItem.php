<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventoryItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'inventory_items';

    protected $fillable = [
        'clinic_id', 'name', 'description', 'category', 'sku', 'quantity',
        'minimum_stock', 'unit', 'unit_cost', 'supplier', 'expiry_date', 'notes', 'active'
    ];

    protected $casts = [
        'expiry_date' => 'date',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function movements()
    {
        return $this->hasMany(InventoryMovement::class);
    }

    public function isLowStock()
    {
        return $this->quantity <= $this->minimum_stock;
    }
}
