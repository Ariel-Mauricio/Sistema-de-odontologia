<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\BlockedSchedule;
use Carbon\Carbon;

class AppointmentService
{
    public function getAvailableSlots($doctorId, $clinicId, $date)
    {
        $slotDuration = 30;
        $workingHours = ['start' => 8, 'end' => 18];
        $slots = [];

        $blocked = BlockedSchedule::where('doctor_id', $doctorId)
            ->whereDate('start_time', $date)
            ->get();

        for ($hour = $workingHours['start']; $hour < $workingHours['end']; $hour++) {
            for ($minute = 0; $minute < 60; $minute += $slotDuration) {
                $slotStart = Carbon::createFromDate($date)->setHour($hour)->setMinute($minute)->setSecond(0);
                $slotEnd = $slotStart->copy()->addMinutes($slotDuration);

                $isBlocked = $blocked->some(function ($block) use ($slotStart, $slotEnd) {
                    return $slotStart->between($block->start_time, $block->end_time) ||
                           $slotEnd->between($block->start_time, $block->end_time);
                });

                $isBooked = Appointment::where('doctor_id', $doctorId)
                    ->where('clinic_id', $clinicId)
                    ->whereBetween('appointment_date', [$slotStart, $slotEnd])
                    ->where('status', '!=', 'cancelled')
                    ->exists();

                if (!$isBlocked && !$isBooked) {
                    $slots[] = [
                        'time' => $slotStart->format('H:i'),
                        'available' => true
                    ];
                }
            }
        }

        return $slots;
    }

    public function rescheduleAppointment(Appointment $appointment, $newDate, $newTime)
    {
        $appointment->update([
            'appointment_date' => Carbon::createFromDateTime($newDate, $newTime)
        ]);

        return $appointment;
    }

    public function cancelAppointment(Appointment $appointment, $reason = null)
    {
        $appointment->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason
        ]);

        return $appointment;
    }
}
