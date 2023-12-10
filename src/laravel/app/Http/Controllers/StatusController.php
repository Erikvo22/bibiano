<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function serverStatus()
    {
        return response()->json(['status' => 'Server is running'], 200);
    }
}
l