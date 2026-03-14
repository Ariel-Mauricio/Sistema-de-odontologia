<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dentogram extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['patient_id', 'clinic_id', 'teeth_data'];

    protected $casts = ['teeth_data' => 'array'];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public static function initializeTeeth()
    {
        $teeth = [];
        for ($i = 11; $i <= 48; $i++) {
            if (!in_array($i % 10, [0])) {
                $teeth[$i] = [
                    'number' => $i,
                    'status' => 'healthy',
                    'treatments' => [],
                    'notes' => ''
                ];
            }
        }
        return $teeth;
    }
}
