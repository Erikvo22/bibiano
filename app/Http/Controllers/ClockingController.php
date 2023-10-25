<?php

namespace App\Http\Controllers;

use App\Models\Clocking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ClockingController extends Controller
{

    public function getClocksActualDay() : JsonResponse
    {
        $user = Auth::user();
        $currentDate = Carbon::now()->format('Y-m-d');
        $clocks = Clocking::where('user_id', $user['id'])
                        ->whereDate('date', '=', $currentDate)
                        ->get();

        return new JsonResponse([
            'data' => $clocks,
            'username' => $user['name']
        ]);
    }

    public function getClocksByUser() : JsonResponse
    {
        $user = Auth::user();
        $clocks = Clocking::where('user_id', $user['id'])
                ->orderBy('date', 'DESC')
                ->get()
                ->groupBy(function($d) {
                    return Carbon::parse($d->date)->format('Y-m-d');
                });

        return new JsonResponse([
            'data' => $clocks,
            'user' => $user
        ]);
    }

    public function store(Request $request) : JsonResponse
    {       
        $user = Auth::user();
        $currentDate = Carbon::now()->setTimezone('Europe/London');
        $type = $request->type;

        $newClock = new Clocking();
        $newClock->user_id = $user['id'];
        $newClock->date = $currentDate;
        $newClock->type = $type;
        $newClock->save();

        return new JsonResponse([
            'success' => true,
            'message' => 'Fichaje realizado'
        ]);
    }
}
