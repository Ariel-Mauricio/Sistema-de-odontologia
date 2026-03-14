<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Clinic;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\MedicalHistory;
use App\Models\TreatmentPlan;
use App\Models\TreatmentItem;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\Dentogram;
use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_CO');

        $clinic = Clinic::firstOrCreate(['email' => 'info@clinicadental.com'], [
            'name' => 'Clínica Dental Principal',
            'phone' => '+573001234567',
            'email' => 'info@clinicadental.com',
            'address' => 'Calle Principal 123',
            'city' => 'Bogotá',
            'state' => 'Cundinamarca',
            'postal_code' => '110111',
            'country' => 'Colombia',
            'business_hours' => 'Lunes a Viernes: 8AM - 6PM',
            'active' => true
        ]);

        $admin = User::updateOrCreate(['email' => 'admin@clinicadental.com'], [
            'name' => 'Administrador',
            'email' => 'admin@clinicadental.com',
            'password' => Hash::make('password123'),
            'phone' => '+573001111111',
            'role' => 'admin',
            'clinic_id' => $clinic->id,
            'active' => true
        ]);

        $doctor = User::updateOrCreate(['email' => 'doctor@clinicadental.com'], [
            'name' => 'Dr. Carlos Pérez',
            'email' => 'doctor@clinicadental.com',
            'password' => Hash::make('password123'),
            'phone' => '+573002222222',
            'role' => 'doctor',
            'speciality' => 'Odontología General',
            'clinic_id' => $clinic->id,
            'active' => true
        ]);

        $doctor2 = User::updateOrCreate(['email' => 'doctor2@clinicadental.com'], [
            'name' => 'Dra. Laura Gómez',
            'email' => 'doctor2@clinicadental.com',
            'password' => Hash::make('password123'),
            'phone' => '+573002223333',
            'role' => 'doctor',
            'speciality' => 'Ortodoncia',
            'clinic_id' => $clinic->id,
            'active' => true
        ]);

        User::updateOrCreate(['email' => 'receptionist@clinicadental.com'], [
            'name' => 'Recepcionista María',
            'email' => 'receptionist@clinicadental.com',
            'password' => Hash::make('password123'),
            'phone' => '+573003333333',
            'role' => 'receptionist',
            'clinic_id' => $clinic->id,
            'active' => true
        ]);

        $assistant = User::updateOrCreate(['email' => 'assistant@clinicadental.com'], [
            'name' => 'Asistente Juan',
            'email' => 'assistant@clinicadental.com',
            'password' => Hash::make('password123'),
            'phone' => '+573004444444',
            'role' => 'assistant',
            'clinic_id' => $clinic->id,
            'active' => true
        ]);

        User::updateOrCreate(['email' => 'patient@gmail.com'], [
            'name' => 'Paciente Pedro',
            'email' => 'patient@gmail.com',
            'password' => Hash::make('password123'),
            'phone' => '+573005555555',
            'role' => 'patient',
            'active' => true
        ]);

        if (Patient::count() < 25) {
            for ($index = 1; $index <= 30; $index++) {
                $patientUser = User::create([
                    'name' => $faker->name(),
                    'email' => 'paciente'.$index.'@clinicadental.com',
                    'password' => Hash::make('password123'),
                    'phone' => '+57'.$faker->numberBetween(3000000000, 3209999999),
                    'role' => 'patient',
                    'active' => true,
                ]);

                $patient = Patient::create([
                    'user_id' => $patientUser->id,
                    'clinic_id' => $clinic->id,
                    'full_name' => $patientUser->name,
                    'document_number' => (string) (100000000 + $index),
                    'document_type' => 'CC',
                    'birth_date' => Carbon::now()->subYears(rand(18, 75))->subDays(rand(0, 365)),
                    'gender' => $faker->randomElement(['M', 'F']),
                    'phone' => $patientUser->phone,
                    'email' => $patientUser->email,
                    'address' => $faker->streetAddress(),
                    'city' => 'Bogotá',
                    'state' => 'Cundinamarca',
                    'postal_code' => (string) $faker->numberBetween(110000, 119999),
                    'allergies' => $faker->boolean(35) ? $faker->randomElement(['Penicilina', 'Anestesia local', 'Látex']) : null,
                    'diseases' => $faker->boolean(30) ? $faker->randomElement(['Hipertensión', 'Diabetes tipo II', 'Ninguna']) : null,
                    'medications' => $faker->boolean(30) ? $faker->randomElement(['Ibuprofeno', 'Metformina', 'Ninguno']) : null,
                    'emergency_contact_name' => $faker->name(),
                    'emergency_contact_phone' => '+57'.$faker->numberBetween(3000000000, 3209999999),
                    'medical_history' => $faker->sentence(10),
                    'credit_balance' => $faker->randomFloat(2, 0, 500000),
                    'insurance_company' => $faker->randomElement(['Sura', 'Sanitas', 'Compensar', null]),
                    'insurance_policy' => $faker->boolean(60) ? 'POL-'.$faker->numberBetween(10000, 99999) : null,
                    'last_visit' => Carbon::now()->subDays(rand(1, 180)),
                    'active' => true,
                ]);

                Dentogram::create([
                    'patient_id' => $patient->id,
                    'clinic_id' => $clinic->id,
                    'teeth_data' => Dentogram::initializeTeeth(),
                ]);
            }
        }

        $patients = Patient::query()->get();
        $doctorIds = [$doctor->id, $doctor2->id];

        if (Appointment::count() < 120) {
            foreach ($patients as $patient) {
                $appointmentsCount = rand(2, 5);
                for ($j = 0; $j < $appointmentsCount; $j++) {
                    Appointment::create([
                        'patient_id' => $patient->id,
                        'doctor_id' => $doctorIds[array_rand($doctorIds)],
                        'clinic_id' => $clinic->id,
                        'appointment_date' => Carbon::now()->subDays(rand(30, 180))->addDays(rand(0, 90))->setTime(rand(8, 17), rand(0, 1) ? 0 : 30),
                        'duration_minutes' => [30, 45, 60][array_rand([30, 45, 60])],
                        'reason' => $faker->randomElement(['Control general', 'Dolor dental', 'Limpieza', 'Ortodoncia', 'Revisión de tratamiento']),
                        'status' => $faker->randomElement(['pending', 'confirmed', 'completed', 'completed', 'cancelled']),
                        'notes' => $faker->sentence(8),
                        'reminder_sent' => $faker->randomElement(['pending', 'sent']),
                    ]);
                }
            }
        }

        if (MedicalHistory::count() < 80) {
            foreach ($patients->take(25) as $patient) {
                $records = rand(1, 3);
                for ($j = 0; $j < $records; $j++) {
                    MedicalHistory::create([
                        'patient_id' => $patient->id,
                        'doctor_id' => $doctorIds[array_rand($doctorIds)],
                        'clinic_id' => $clinic->id,
                        'consultation_date' => Carbon::now()->subDays(rand(10, 200)),
                        'diagnosis' => $faker->randomElement(['Caries superficial', 'Gingivitis leve', 'Bruxismo', 'Control preventivo']),
                        'observations' => $faker->sentence(12),
                        'evolution' => $faker->sentence(10),
                        'treatment_plan' => $faker->sentence(8),
                        'medications_prescribed' => $faker->randomElement(['Ibuprofeno 400mg', 'Amoxicilina 500mg', 'Ninguno']),
                        'recommendations' => $faker->sentence(10),
                        'next_visit' => Carbon::now()->addDays(rand(7, 45)),
                    ]);
                }
            }
        }

        if (TreatmentPlan::count() < 60) {
            foreach ($patients->take(25) as $patient) {
                $plans = rand(1, 2);
                for ($j = 0; $j < $plans; $j++) {
                    $total = $faker->randomFloat(2, 200000, 1800000);
                    $paid = $faker->randomFloat(2, 0, $total);

                    $plan = TreatmentPlan::create([
                        'patient_id' => $patient->id,
                        'doctor_id' => $doctorIds[array_rand($doctorIds)],
                        'clinic_id' => $clinic->id,
                        'name' => $faker->randomElement(['Plan Integral', 'Ortodoncia', 'Rehabilitación Oral', 'Tratamiento Restaurativo']),
                        'description' => $faker->sentence(15),
                        'start_date' => Carbon::now()->subDays(rand(5, 120)),
                        'estimated_end_date' => Carbon::now()->addDays(rand(20, 180)),
                        'status' => $faker->randomElement(['pending', 'in_process', 'completed']),
                        'total_cost' => $total,
                        'paid_amount' => $paid,
                        'notes' => $faker->sentence(8),
                    ]);

                    $items = rand(2, 5);
                    for ($k = 0; $k < $items; $k++) {
                        TreatmentItem::create([
                            'treatment_plan_id' => $plan->id,
                            'treatment_name' => $faker->randomElement(['Profilaxis', 'Resina', 'Endodoncia', 'Corona', 'Implante']),
                            'description' => $faker->sentence(8),
                            'tooth_number' => $faker->numberBetween(11, 48),
                            'tooth_status' => $faker->randomElement(['healthy', 'caries', 'restoration', 'crown', 'implant']),
                            'cost' => $faker->randomFloat(2, 60000, 600000),
                            'status' => $faker->randomElement(['pending', 'in_process', 'completed']),
                            'planned_date' => Carbon::now()->addDays(rand(1, 90)),
                            'notes' => $faker->sentence(6),
                        ]);
                    }
                }
            }
        }

        if (Invoice::count() < 70) {
            foreach ($patients->take(25) as $patient) {
                $invoices = rand(1, 3);
                for ($j = 0; $j < $invoices; $j++) {
                    $subtotal = $faker->randomFloat(2, 120000, 1500000);
                    $tax = round($subtotal * 0.19, 2);
                    $total = $subtotal + $tax;
                    $paid = $faker->randomFloat(2, 0, $total);

                    $invoice = Invoice::create([
                        'invoice_number' => 'FAC-'.Carbon::now()->format('Ymd').'-'.Str::upper(Str::random(6)),
                        'patient_id' => $patient->id,
                        'clinic_id' => $clinic->id,
                        'invoice_date' => Carbon::now()->subDays(rand(1, 120)),
                        'due_date' => Carbon::now()->addDays(rand(5, 45)),
                        'description' => $faker->randomElement(['Tratamiento odontológico', 'Paquete de limpieza y control', 'Procedimientos clínicos']),
                        'subtotal' => $subtotal,
                        'tax' => $tax,
                        'total' => $total,
                        'paid_amount' => $paid,
                        'status' => $paid <= 0 ? 'pending' : ($paid < $total ? 'partial' : 'paid'),
                        'notes' => $faker->sentence(8),
                    ]);

                    if ($paid > 0) {
                        Payment::create([
                            'invoice_id' => $invoice->id,
                            'patient_id' => $patient->id,
                            'clinic_id' => $clinic->id,
                            'amount' => $paid,
                            'payment_method' => $faker->randomElement(['cash', 'card', 'transfer']),
                            'reference_number' => 'REF-'.$faker->numberBetween(10000, 99999),
                            'payment_date' => Carbon::now()->subDays(rand(0, 30)),
                            'receipt_number' => 'RCPT-'.Str::upper(Str::random(8)),
                            'notes' => $faker->sentence(5),
                        ]);
                    }
                }
            }
        }

        if (InventoryItem::count() < 20) {
            $categories = ['Insumos', 'Instrumental', 'Medicamentos', 'Bioseguridad'];
            $units = ['unidad', 'caja', 'frasco', 'paquete'];

            for ($index = 1; $index <= 24; $index++) {
                $quantity = rand(10, 160);
                $minimum = rand(8, 35);

                $item = InventoryItem::create([
                    'clinic_id' => $clinic->id,
                    'name' => $faker->randomElement(['Guantes de nitrilo', 'Anestesia local', 'Resina compuesta', 'Mascarilla quirúrgica', 'Agujas descartables', 'Sutura dental']).' '.$index,
                    'description' => $faker->sentence(8),
                    'category' => $categories[array_rand($categories)],
                    'sku' => 'SKU-'.str_pad((string) $index, 4, '0', STR_PAD_LEFT),
                    'quantity' => $quantity,
                    'minimum_stock' => $minimum,
                    'unit' => $units[array_rand($units)],
                    'unit_cost' => $faker->randomFloat(2, 2000, 85000),
                    'supplier' => $faker->company(),
                    'expiry_date' => Carbon::now()->addDays(rand(30, 720)),
                    'notes' => $faker->sentence(6),
                    'active' => true,
                ]);

                InventoryMovement::create([
                    'inventory_item_id' => $item->id,
                    'clinic_id' => $clinic->id,
                    'type' => 'entry',
                    'quantity' => rand(5, 40),
                    'reason' => 'Carga inicial de inventario',
                    'reference_number' => 'MOV-ENT-'.$index,
                    'user_id' => $assistant->id,
                ]);

                InventoryMovement::create([
                    'inventory_item_id' => $item->id,
                    'clinic_id' => $clinic->id,
                    'type' => 'exit',
                    'quantity' => rand(1, 10),
                    'reason' => 'Consumo clínico semanal',
                    'reference_number' => 'MOV-SAL-'.$index,
                    'user_id' => $assistant->id,
                ]);
            }
        }
    }
}
