import { UserIcon, LockClosedIcon } from '@heroicons/react/solid';
import { ArrowRightIcon } from '@heroicons/react/outline'; 
import { useState } from 'react';
import axiosClient from '../axios';
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate, Navigate } from 'react-router-dom';
import { Image, Modal } from 'antd';

export default function Login() {

  const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({__html: ''});
  const navigate = useNavigate();

  if (userToken) {
    return <Navigate to="/dashboard" />
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    setError({ __html: "" });

    axiosClient
      .post("/login", {
        email,
        password
      })
      .then(({data}) => {
          if(data.error){
            setError({__html: data.error});
          }else{
            setCurrentUser(data.user);
            setUserToken(data.token);
          }
          if (userToken) 
            navigate("/dashboard");
      })
      .catch((error) => {
          if (error.response){
            const finalErrors = Object.values(error.response.data.errors).reduce(
              (accum, next) => [...accum, ...next],
              []
            );
            setError({__html: finalErrors.join('<br>')});
          }else{
            Modal.error({
              title: 'Ha ocurrido un error inesperado',
              content: 'Inténtalo más tarde o contacta con el administrador',
              okButtonProps: {
                style: { background: 'green', color: 'white' }
              },
            });
          }
      })
  }

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-green-25">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <span>
            <Image src="/logo.svg" preview={false}/>
          </span>
        
        {error.__html && (
          <div
            className="bg-red-500 rounded py-2 px-3 mt-2 text-white"
            dangerouslySetInnerHTML={error}
          ></div>
        )}

        <form onSubmit={onSubmit} method="POST" className="mt-4">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2 inline-flex">
              <UserIcon className="w-5 h-5"/>Email
            </label>
            <div>
              <input id="email" type="email" 
                    value={email}
                    onChange={ev => setEmail(ev.target.value)} 
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
                    value={password}
                    onChange={ev => setPassword(ev.target.value)} 
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
            <a href="#" className="text-gray-600 hover:underline">¿Olvidaste la contraseña?</a>
          </div>*/}
        </form>
        <p className="text-center text-gray-600 mt-6">Si no tienes una cuenta, contacta con el administrador</p>
      {/*<div className="mt-4">
          <p className="text-center text-gray-600">O accede con:</p>
          <div className="flex justify-center mt-2">
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