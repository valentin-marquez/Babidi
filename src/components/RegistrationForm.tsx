import React, { useState, useRef } from "react";
import { Mail } from "lucide-react";
import { signUpEmail, signInWithGoogle } from "@lib/auth";

import { GoogleIcon, SpinnerAnimation } from "@components/Utils";

import PasswordInput from "@components/PasswordInput";

function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [showGoogleRegistration, setShowGoogleRegistration] = useState(true);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  // Estado para almacenar mensajes de error
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleEnterPress = async (e) => {
    if (e.key === "Enter") {
      if (emailInputRef.current === document.activeElement) {
        passwordInputRef.current.focus();
      } else if (passwordInputRef.current) {
        await handleEmailSubmit();
      }
    }
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") return false;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const handleEmailSubmit = async () => {
    "use server";
    setLoadingLogin(true);
    // Limpiar los mensajes de error
    setErrors({
      email: "",
      password: "",
      general: "",
    });

    if (!email || email.trim() === "") {
      setErrors({ ...errors, email: "Debe ingresar un correo válido" });
      setLoadingLogin(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ ...errors, email: "El formato de correo es inválido" });
      setLoadingLogin(false);
      return;
    }

    if (!password || password.trim() === "") {
      setErrors({ ...errors, password: "Debe ingresar una contraseña" });
      setLoadingLogin(false);
      return;
    }

    try {
      const response = await signUpEmail(email, password);
      if (response.error && response.error.name === "AuthError") {
        setErrors({ ...errors, email: "El correo ingresado ya existe" });
        setLoadingLogin(false);
        return;
      } else {
        setEmailConfirmationSent(true);
        setLoadingLogin(false);
        setShowGoogleRegistration(false);
      }
    } catch (error) {
      console.error("Error al enviar el código de confirmación:", error);
      setErrors({
        ...errors,
        general: "Hubo un error al procesar su solicitud",
      });
      setLoadingLogin(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setLoadingGoogle(true);
    await signInWithGoogle();
  };

  return (
    <section className="inset-0 flex h-full min-h-screen w-full flex-col items-center bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] lg:space-y-10">
      <a href="/" className="btn btn-ghost mt-4">
        <img
          src="/images/logo/logo-dark.svg"
          alt="Babidi"
          width="190"
          height="40"
          decoding="async"
        />
      </a>
      <div className="flex flex-col space-y-2 p-10 lg:p-0">
        <div className="flex flex-row justify-center">
          <h1 className="max-w-xs text-center font-syne text-6xl font-normal text-white lg:max-w-md">
            Únete a <span className="text-primary">Babidi</span>
          </h1>
        </div>
        {emailConfirmationSent ? (
          <div className="max-w-md text-center">
            Hemos enviado un enlace de confirmación a su correo electrónico. Por
            favor, revíselo para continuar.
          </div>
        ) : (
          <div className="form-control w-full max-w-full space-y-5">
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text">Correo</span>
                {errors.email && (
                  <span className="label-text-alt text-error">
                    {errors.email}
                  </span>
                )}
              </label>
              <input
                type="email"
                placeholder="Dirección de correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={handleEnterPress}
                ref={emailInputRef}
                className={`input input-bordered w-full transition-colors hover:input-primary focus:input-primary ${
                  errors.email ? "input-error focus:input-error" : ""
                }`}
              />
            </div>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              onKeyUp={handleEnterPress}
              ref={passwordInputRef}
            />
            <button
              className="btn-full btn bg-white text-black transition-all hover:bg-gray-200"
              onClick={handleEmailSubmit}
            >
              {loadingLogin ? (
                <div>
                  <SpinnerAnimation />
                </div>
              ) : null}
              {loadingLogin ? (
                "Cargando..."
              ) : (
                <>
                  <Mail size={24} className="mr-2" /> Registrarse con correo
                </>
              )}
            </button>
          </div>
        )}
        {showGoogleRegistration && (
          <>
            <div className="divider">O</div>
            <button className="btn-full btn" onClick={handleGoogleSubmit}>
              {loadingGoogle ? (
                <div>
                  <SpinnerAnimation />
                </div>
              ) : null}
              {loadingGoogle ? (
                "Cargando..."
              ) : (
                <>
                  <GoogleIcon /> Registrarse con Google
                </>
              )}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default RegistrationForm;
