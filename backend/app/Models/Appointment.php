<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id', 'doctor_id', 'clinic_id', 'appointment_date', 'duration_minutes',
        'reason', 'status', 'notes', 'reminder_sent', 'cancelled_at', 'cancellation_reason'
    ];

    protected $casts = [
        'appointment_date' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function getAvailableSlots($doctorId, $clinicId, $date)
    {
        $booked = self::where('doctor_id', $doctorId)
            ->where('clinic_id', $clinicId)
            ->whereDate('appointment_date', $date)
            ->where('status', '!=', 'cancelled')
            ->pluck('appointment_date')
            ->toArray();

        return $this->generateTimeSlots($booked);
    }

    private function generateTimeSlots($booked)
    {
        $slots = [];
        for ($hour = 8; $hour < 18; $hour++) {
            for ($min = 0; $min < 60; $min += 30) {
                $time = sprintf("%02d:%02d", $hour, $min);
                $slots[] = ['time' => $time, 'available' => !in_array($time, $booked)];
            }
        }
        return $slots;
    }
}
