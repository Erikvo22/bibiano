<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('firstname', 50)->nullable();
            $table->string('secondname', 50)->nullable();
            $table->string('dni', 9)->unique();
            $table->string('email', 128)->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password', 128);
            $table->dateTime('last_login')->nullable();
            $table->integer('access_number')->nullable();
            $table->enum('role', ['USER', 'ADMIN']);
            $table->integer('mobile')->nullable();
            $table->boolean('active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::table('clockings', function (Blueprint $table) {
        //     $table->dropForeign(['user_id']); // Asegúrate de que 'user_id' es el nombre correcto de la columna.
        // });
        Schema::dropIfExists('users');
    }
};
