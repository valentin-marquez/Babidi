import React, { useState, useRef } from "react";
import { Mail } from "lucide-react";
import { signInWithEmail, signInWithGoogle } from "@lib/auth";
import { SpinnerAnimation, GoogleIcon } from "@components/Utils";
import PasswordInput from "@components/PasswordInput";
import Cookies from "js-cookie";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailSentText, setShowEmailSentText] = useState(false);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleEnterPress = async (e) => {
    if (e.key === "Enter") {
      if (emailInputRef.current === document.activeElement) {
        passwordInputRef.current.focus();
      } else if (passwordInputRef.current) {
        handleEmailSubmit();
      }
    }
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") return false;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    return password.trim() !== "";
  };

  const handleEmailSubmit = async () => {
    "use server";
    if (!validateEmail(email)) {
      setErrors({ ...errors, email: "El formato de correo es inválido" });
      setEmailError(true);
      return;
    }

    if (!validatePassword(password)) {
      setErrors({ ...errors, password: "Debe ingresar una contraseña" });
      setPasswordError(true);
      return;
    }

    try {
      setLoadingLogin(true);
      setErrors({ email: "", password: "" });
      const { auth, error } = await signInWithEmail(email, password);
      if (auth) {
        setLoadingLogin(false);
        setShowEmailSentText(true);
        const accessToken = auth.session.access_token;
        const expiresInSeconds = auth.session.expires_in;
        Cookies.set("sbat", accessToken, { expires: expiresInSeconds / 86400 });
        if (auth.user.user_metadata.onboarding) {
          window.location.href = "/home";
        } else {
          window.location.href = "/onboarding";
        }
      } else if (error) {
        setLoadingLogin(false);

        console.error("Error al iniciar sesión:", error);
      }
    } catch (error) {
      setLoadingLogin(false);
      setErrors({
        ...errors,
        email: "El correo o la contraseña son incorrectos",
        password: "",
      });
      console.error("Error al iniciar sesión:", error);
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
            Intercambia con <span className="text-primary">Babidi</span>
          </h1>
        </div>
        {emailSent ? (
          <div className="space-y-5">
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text">Código</span>
              </label>
              <input
                type="text"
                placeholder="Código del correo"
                value={password} // You may want to change this to 'code'
                onChange={(e) => {
                  setPassword(e.target.value); // You may want to change this to 'setCode'
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleEmailSubmit();
                  }
                }}
                className="input input-bordered w-full transition-colors hover:input-primary focus:input-primary"
              />
            </div>
            {showEmailSentText && (
              <div className="max-w-md text-center">
                Acabamos de enviarle un código de inicio de sesión temporal.
                <br />
                Por favor revise su bandeja de entrada. <br />
                ¿No puede encontrarlo?{" "}
                <span
                  className="cursor-pointer text-primary"
                  onClick={() => setShowEmailSentText(false)}
                >
                  Intentar otra vez
                </span>
              </div>
            )}
            <div className="flex w-full flex-row justify-end">
              <button
                className="btn btn-block bg-white text-black transition-all hover:bg-gray-200"
                onClick={handleEmailSubmit}
              >
                <Mail size={24} className="mr-2" />
                Entrar con Correo
              </button>
            </div>
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
                  <Mail size={24} className="mr-2" /> Entrar Con Correo
                </>
              )}
            </button>
          </div>
        )}
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
              <GoogleIcon /> Entrar con Google
            </>
          )}
        </button>
      </div>
    </section>
  );
}

export default LoginForm;
