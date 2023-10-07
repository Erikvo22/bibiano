<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UsersSeeder extends Seeder
{
    public function run()
    {
        $roleWithPermissions = Role::create(['name' => 'admin']);
        $permission = Permission::create(['name' => 'general']);
        $roleWithPermissions->givePermissionTo($permission);

        $userWithPermissions = User::create([
            'name' => 'Erik',
            'firstname' => 'Viera',
            'secondname' => 'Olivares',
            'dni' => '11111111A',
            'email' => 'erikv@gmail.com',
            'password' => bcrypt('1234'),
        ]);
        $userWithPermissions->assignRole($roleWithPermissions);

        User::create([
            'name' => 'Antonio',
            'firstname' => 'Arjones',
            'secondname' => 'Bello',
            'dni' => '11111111B',
            'email' => 'antonioj@gmail.com',
            'password' => bcrypt('1234'),
        ]);
    }
}