<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'clinic_id', 'full_name', 'document_number', 'document_type',
        'birth_date', 'gender', 'phone', 'email', 'address', 'city', 'state',
        'postal_code', 'allergies', 'diseases', 'medications', 'emergency_contact_name',
        'emergency_contact_phone', 'medical_history', 'credit_balance', 'insurance_company',
        'insurance_policy', 'last_visit', 'active'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'last_visit' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function medicalHistories()
    {
        return $this->hasMany(MedicalHistory::class);
    }

    public function treatmentPlans()
    {
        return $this->hasMany(TreatmentPlan::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function documents()
    {
        return $this->hasMany(PatientDocument::class);
    }

    public function dentogram()
    {
        return $this->hasOne(Dentogram::class);
    }
}
