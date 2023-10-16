<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function store(Request $request)
    {       
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'firstname' => 'sometimes|string|max:50',
            'secondname' => 'sometimes|string|max:50',
            'dni' => 'sometimes|string|max:9|unique:users',
            'role' => 'required|string|max:128',
            'mobile' => 'sometimes|string|max:14',
            'email' => 'required|string|email|max:128|unique:users',
            'password' => 'required|string|min:8|max:128',
        ],[
            'email.unique' => 'El correo electrónico ya está en uso.',
            'dni.unique' => 'El dni ya está en uso.',
        ]);
        
        if ($validator->fails()) {
            return new JsonResponse([
                'success' => false,
                'message' => 'No cumple los siguientes requisitos del formulario',
                'errors' => $validator->errors(),
            ]);
        }

        $validatedData = $validator->validated();

        $user = new User();
        $user->name = $validatedData['name'];
        $user->firstname = $validatedData['firstname'] ?? '';
        $user->secondname = $validatedData['secondname'] ?? '';
        $user->dni = $validatedData['dni'] ?? '';
        $user->role = $validatedData['role'];
        $user->mobile = $validatedData['mobile'] ?? null;
        $user->email = $validatedData['email'];
        $user->password = bcrypt($validatedData['password']);
        $user->save();


        return new JsonResponse([
            'success' => true,
            'message' => 'Usuario creado correctamente.',
            'user' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'firstname' => 'required|string|max:255',
            'secondname' => 'nullable|string|max:255',
            'dni' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'mobile' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,',
            'password' => 'nullable|string|min:8',
        ],[
            'email.unique' => 'El correo electrónico ya está en uso.',
            'dni.unique' => 'El dni ya está en uso.',
        ]);

        $user = User::find($id);
        $user->name = $validatedData['name'];
        $user->firstname = $validatedData['firstname'];
        $user->secondname = $validatedData['secondname'];
        $user->dni = $validatedData['dni'];
        $user->role = $validatedData['role'];
        $user->mobile = $validatedData['mobile'];
        $user->email = $validatedData['email'];
        if (!empty($validatedData['password'])) {
            $user->password = bcrypt($validatedData['password']);
        }
        $user->save();

        return new JsonResponse([
            'success' => true,
            'message' => 'Usuario actualizado correctamente.',
            'user' => $user,
        ]);
    }
}
