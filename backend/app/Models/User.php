<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'phone', 'password', 'role', 'speciality', 'schedule',
        'clinic_id', 'document_number', 'birth_date', 'address', 'active'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
    ];

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function patient()
    {
        return $this->hasOne(Patient::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function medicalHistories()
    {
        return $this->hasMany(MedicalHistory::class, 'doctor_id');
    }

    public function treatmentPlans()
    {
        return $this->hasMany(TreatmentPlan::class, 'doctor_id');
    }

    public function clinics()
    {
        return $this->belongsToMany(Clinic::class, 'clinic_doctor');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function blockedSchedules()
    {
        return $this->hasMany(BlockedSchedule::class, 'doctor_id');
    }
}
