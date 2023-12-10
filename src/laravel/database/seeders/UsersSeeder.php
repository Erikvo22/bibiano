<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Erik',
            'firstname' => 'Viera',
            'secondname' => 'Olivares',
            'dni' => '11111111A',
            'email' => 'erikv@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'USER',
            'active' => true,
        ]);

        User::create([
            'name' => 'Antonio',
            'firstname' => 'Arjones',
            'secondname' => 'Bello',
            'dni' => '11111111B',
            'email' => 'antonioj@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'ADMIN',
            'active' => false,
        ]);
    }
}
