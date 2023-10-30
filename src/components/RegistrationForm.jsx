import React, { useState } from 'react';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { signUp } from "@lib/auth"

import { GoogleIcon, SpinnerAnimation } from '@components/Utils';

import PasswordInput from '@components/PasswordInput';

function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [showGoogleRegistration, setShowGoogleRegistration] = useState(true);

  // Estado para almacenar mensajes de error
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const validateEmail = (email) => {
    if (!email || email.trim() === "") return false;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  const handleEmailSubmit = async () => {
    setLoading(true);
    // Limpiar los mensajes de error
    setErrors({
      email: '',
      password: '',
      general: ''
    });

    if (!email || email.trim() === "") {
      setErrors({ ...errors, email: 'Debe ingresar un correo válido' });
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ ...errors, email: 'El formato de correo es inválido' });
      setLoading(false);
      return;
    }

    if (!password || password.trim() === "") {
      setErrors({ ...errors, password: 'Debe ingresar una contraseña' });
      setLoading(false);
      return;
    }

    try {
      const response = await signUp(email, password);
      if (response.error && response.error.name === 'AuthError') {
        setErrors({ ...errors, email: 'El correo ingresado ya existe' });
        setLoading(false);
        return;
      } else {
        setEmailConfirmationSent(true);
        setLoading(false);
        setShowGoogleRegistration(false);
      }
    } catch (error) {
      console.error("Error al enviar el código de confirmación:", error);
      setErrors({ ...errors, general: 'Hubo un error al procesar su solicitud' });
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center lg:space-y-10 min-h-screen inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <a href="/" className="btn btn-ghost mt-4">
        <img
          src="/logo/logo-dark.svg"
          alt="Babidi"
          width="190"
          height="40"
          decoding="async"
        />
      </a>
      <div className="flex flex-col space-y-2 p-10 lg:p-0">
        <div className='flex flex-row justify-center'>
          <h1 className="font-normal font-syne text-6xl text-white max-w-xs lg:max-w-md text-center">
            Únete a <span className="text-primary">Babidi</span>
          </h1>
        </div>
        {emailConfirmationSent ? (
          <div className='text-center max-w-md'>
            Hemos enviado un enlace de confirmación a su correo electrónico. Por favor, revíselo para continuar.
          </div>
        ) : (
          <div className="form-control w-full max-w-full space-y-5">
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text">Correo</span>
                {errors.email && (
                  <span className="label-text-alt text-error">
                    {errors.email}
                  </span >
                )}
              </label>
              <input
                type="email"
                placeholder="Dirección de correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailSubmit();
                  }
                }}
                className={`input input-bordered w-full hover:input-primary focus:input-primary transition-colors ${errors.email ? 'input-error focus:input-error' : ''}`}
              />
            </div>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <button className="btn btn-full bg-white text-black hover:bg-gray-200 transition-all" onClick={handleEmailSubmit}>
              {loading ? <div>
                <SpinnerAnimation />
              </div> : null}
              {loading ? 'Cargando...' : <><Mail size={24} className="mr-2" /> Registrarse con correo</>}
            </button>
          </div>
        )}
        {showGoogleRegistration && (
          <>
            <div className="divider">O</div>
            <a className="btn btn-full">
              <GoogleIcon />
              Registrarse con Google
            </a>
          </>
        )}
      </div>
    </section>
  );
}

export default RegistrationForm;