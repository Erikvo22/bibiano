import { UserIcon, LockClosedIcon } from '@heroicons/react/solid';
import { ArrowRightIcon } from '@heroicons/react/outline'; 

export default function Login() {
  return (
    <>
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          <span className="bg-gradient-to-r text-transparent from-green-800 to-green-300 bg-clip-text">
            Comercial Bibiano
          </span>
        </h2>
        <form>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 inline-flex">
              <UserIcon className="w-5 h-5"/>Email
            </label>
            <div>
              <input id="email" type="email" 
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    placeholder="Introduce tu email" 
                    required/>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 inline-flex">
              <LockClosedIcon className="w-5 h-5"/>Contraseña
            </label>
            <div>
              <input id="password" type="password" 
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    placeholder="Introduce la contraseña" 
                    required/>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button type="submit" className="items-center justify-center bg-gradient-to-r from-green-800 to-green-300 hover:from-green-500 hover:to-green-100 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full inline-flex">
              <ArrowRightIcon className="w-5 h-5"/>
              Acceder
            </button>
          </div>
          {/*<div className="text-center mt-4">
            <a href="#" className="text-gray-600 hover:underline">Forgot password?</a>
          </div>*/}
        </form>
        <p className="text-center text-gray-600 mt-6">Si no tienes una cuenta, contacta con el administrador</p>
      {/*<div className="mt-4">
          <p className="text-center text-gray-600">Or log in with:</p>
          <div className="flex justify-center mt-2">
            <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mx-2">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2">
              <i className="fab fa-google"></i>
            </a>
          </div>
        </div>*/}
      </div>
    </div>
    </>
  )
}