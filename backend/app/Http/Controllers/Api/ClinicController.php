<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClinicRequest;
use App\Models\Clinic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClinicController extends Controller
{
    public function index(): JsonResponse
    {
        $clinics = Clinic::all();
        return response()->json($clinics);
    }

    public function show(Clinic $clinic): JsonResponse
    {
        $clinic->load(['doctors', 'patients']);
        return response()->json($clinic);
    }

    public function store(StoreClinicRequest $request): JsonResponse
    {
        $clinic = Clinic::create($request->validated());
        return response()->json($clinic, 201);
    }

    public function update(Request $request, Clinic $clinic): JsonResponse
    {
        $clinic->update($request->validated());
        return response()->json($clinic);
    }

    public function assignDoctor(Request $request, Clinic $clinic): JsonResponse
    {
        $validated = $request->validate(['doctor_id' => 'required|exists:users,id']);
        $clinic->doctors()->attach($validated['doctor_id']);
        return response()->json(['message' => 'Doctor assigned']);
    }

    public function removeDoctor(Request $request, Clinic $clinic): JsonResponse
    {
        $validated = $request->validate(['doctor_id' => 'required|exists:users,id']);
        $clinic->doctors()->detach($validated['doctor_id']);
        return response()->json(['message' => 'Doctor removed']);
    }
}
