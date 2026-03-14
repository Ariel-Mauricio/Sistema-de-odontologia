<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PatientDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function getByPatient($patientId): JsonResponse
    {
        $documents = PatientDocument::where('patient_id', $patientId)->get();
        return response()->json($documents);
    }

    public function store(Request $request, $patientId): JsonResponse
    {
        $validated = $request->validate([
            'document_type' => 'required|in:radiography,photo,prescription,consent,report,other',
            'file' => 'required|file|max:5120',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('documents/' . $patientId, 'public');

            $document = PatientDocument::create([
                'patient_id' => $patientId,
                'clinic_id' => auth()->user()->clinic_id ?? 1,
                'document_type' => $validated['document_type'],
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'description' => $validated['description'] ?? null,
                'upload_date' => now(),
                'uploaded_by' => auth()->id()
            ]);

            return response()->json($document, 201);
        }

        return response()->json(['error' => 'No file provided'], 400);
    }

    public function destroy(PatientDocument $document): JsonResponse
    {
        $document->delete();
        return response()->json(['message' => 'Document deleted']);
    }
}
