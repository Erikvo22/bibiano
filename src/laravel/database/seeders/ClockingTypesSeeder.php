<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClockingTypes;

class ClockingTypesSeeder extends Seeder
{
    public function run()
    {
        ClockingTypes::create([
            'name' => 'Entrada'
        ]);

        ClockingTypes::create([
            'name' => 'Finalizar la jornada'
        ]);

        ClockingTypes::create([
            'name' => 'Comida'
        ]);

        ClockingTypes::create([
            'name' => 'Médico'
        ]);

        ClockingTypes::create([
            'name' => 'Permiso'
        ]);

        ClockingTypes::create([
            'name' => 'Otro...'
        ]);
    }
}