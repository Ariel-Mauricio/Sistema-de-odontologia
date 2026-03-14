<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Clinic extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'description', 'phone', 'email', 'address', 'city', 'state',
        'postal_code', 'country', 'ruc', 'business_hours', 'logo_path', 'active'
    ];

    public function patients()
    {
        return $this->hasMany(Patient::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function doctors()
    {
        return $this->belongsToMany(User::class, 'clinic_doctor', 'clinic_id', 'doctor_id');
    }

    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function medicalHistories()
    {
        return $this->hasMany(MedicalHistory::class);
    }
}
