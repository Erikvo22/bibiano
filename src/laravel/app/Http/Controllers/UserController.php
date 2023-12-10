<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    public function getInfoUser()
    {
        $user = Auth::user();
        $user = User::find($user->id);
        return new JsonResponse([
            'data' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'firstname' => 'nullable|string|max:50',
            'secondname' => 'nullable|string|max:50',
            'dni' => 'required|string|max:9|unique:users',
            'role' => 'required|string|max:128',
            'mobile' => 'nullable|max:14',
            'email' => 'nullable|string|email|max:128|unique:users',
            'password' => 'required|string|min:8|max:128',
        ], [
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'firstname' => 'sometimes|string|max:50',
            'secondname' => 'sometimes|string|max:50',
            'role' => 'required|string|max:128',
            'mobile' => 'sometimes|max:14',
            'dni' => 'required|string|max:9',
            'email' => 'sometimes|string|email|max:128',
        ]);


        $validatedData = $validator->validated();


        if (User::where('dni', $validatedData['dni'])->where('id', '!=', $id)->exists()) {
            return new JsonResponse([
                'success' => false,
                'message' => 'El DNI ya está en uso por otro usuario.',
            ]);
        }

        if (User::where('email', $validatedData['email'])->where('id', '!=', $id)->exists()) {
            return new JsonResponse([
                'success' => false,
                'message' => 'El correo electrónico ya está en uso por otro usuario.',
            ]);
        }

        $user = User::find($id);
        $user->name = $validatedData['name'];
        $user->firstname = $validatedData['firstname'];
        $user->secondname = $validatedData['secondname'];
        $user->dni = $validatedData['dni'];
        $user->role = $validatedData['role'];
        $user->mobile = $validatedData['mobile'];
        $user->email = $validatedData['email'];

        $user->save();

        return new JsonResponse([
            'success' => true,
            'message' => 'Usuario actualizado correctamente.',
            'user' => $user,
        ]);
    }

    public function toggleActive(Request $request)
    {
        $data = $request->all();

        $user = User::find($data['id']);

        if (!$user) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Usuario no encontrado.',
            ]);
        }

        $user->active = $data['active'];
        $user->save();

        return new JsonResponse([
            'success' => true,
            'message' => 'Estado de usuario actualizado correctamente.',
            'user' => $user,
        ]);
    }

    public function updatePasswordUser(Request $request)
    {
        $data = $request->all();
        $newPassword = $data['newPassword'];

        $user = User::find($data['id']);

        if (!$user) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Usuario no encontrado.',
            ], 404);
        }

        $user->password = bcrypt($newPassword);
        $user->save();

        return new JsonResponse([], 204);
    }
}
