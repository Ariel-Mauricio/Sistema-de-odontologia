<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PatientDocument extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'patient_documents';

    protected $fillable = [
        'patient_id', 'clinic_id', 'document_type', 'file_name', 'file_path',
        'file_type', 'file_size', 'description', 'upload_date', 'uploaded_by'
    ];

    protected $casts = [
        'upload_date' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
