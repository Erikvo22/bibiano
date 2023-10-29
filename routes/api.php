<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClockingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['middleware' => ['jwt.auth', 'api-header']], function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::controller(UserController::class)->group(function () {

        Route::get('users/list', function () {
            $users = User::all();
            $response = ['success' => true, 'data' => $users];
            return response()->json($response, 201);
        });
        Route::post('/user', 'store');
        Route::put('/user/reset-password', 'updatePasswordUser');
        Route::put('/user/{id}', 'update');
    });

    Route::controller(ClockingController::class)->group(function () {
        Route::get('clocks/list', 'getClocksActualDay');
        Route::post('clocks/all', 'getClocksByUser');
        Route::post('clocks/save', 'store');
    });

    Route::controller(UserController::class)->group(
        function () {
            Route::post('/user', 'store');
            Route::put('/user/{id}', 'update');
            Route::post('/user/active',  'toggleActive');
        }
    );
});

Route::group(['middleware' => 'api-header'], function () {
    Route::post('/login', [AuthController::class, 'login']);
});
