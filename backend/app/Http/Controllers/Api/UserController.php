<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::with('clinic')->paginate(20);
        return response()->json($users);
    }

    public function show(User $user): JsonResponse
    {
        $user->load('clinic');
        return response()->json($user);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'required|string',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,doctor,receptionist,assistant,patient',
            'speciality' => 'nullable|string',
            'clinic_id' => 'required|exists:clinics,id',
            'active' => 'boolean'
        ]);

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'password' => Hash::make($request->input('password')),
            'role' => $request->input('role'),
            'speciality' => $request->input('speciality'),
            'clinic_id' => $request->input('clinic_id'),
            'active' => $request->input('active', true)
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string',
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|in:admin,doctor,receptionist,assistant,patient',
            'speciality' => 'nullable|string',
            'clinic_id' => 'sometimes|exists:clinics,id',
            'active' => 'sometimes|boolean'
        ]);

        $data = $request->validated();
        
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->input('password'));
        }

        $user->update($data);
        return response()->json($user);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }

    public function changePassword(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed'
        ]);

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json(['error' => 'La contraseña actual es incorrecta'], 422);
        }

        $user->update([
            'password' => Hash::make($request->input('new_password'))
        ]);

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }

    public function toggleActive(User $user): JsonResponse
    {
        $user->update(['active' => !$user->active]);
        return response()->json($user);
    }

    public function getDoctors(): JsonResponse
    {
        $doctors = User::where('role', 'doctor')
            ->with('clinic')
            ->get();
        return response()->json($doctors);
    }
}
