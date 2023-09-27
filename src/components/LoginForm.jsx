import React, { useState } from 'react';
import { Send, Mail } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [code, setCode] = useState('');
  const [showEmailSentText, setShowEmailSentText] = useState(false);

  const validateEmail = (email) => {
    if (!email || email.trim() === "") return false;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  const handleEmailSubmit = async () => {

    if (!email || email.trim() === ""){
      setEmailError(true);
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    // Simular un proceso de envío de correo (aquí puedes realizar la lógica real)
    setLoading(true);
    // En el mundo real, aquí enviarías un correo electrónico al correo proporcionado.
    // Puedes utilizar servicios como SendGrid o Nodemailer en Node.js para enviar correos.
    setTimeout(() => {

      setLoading(false);
      setEmailSent(true);
      setShowEmailSentText(true); // Mostrar el texto después de enviar el correo
    }, 2000); // Simulamos una respuesta después de 2 segundos
  };

  const handleCodeSubmit = () => {
    // Aquí puedes manejar la validación del código y realizar acciones adicionales si es necesario.
    // Por ejemplo, si el código es correcto, puedes iniciar sesión en el usuario.
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
                value={code}
                onChange={(e) => {
                 setCode(e.target.value)
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleCodeSubmit();
                  }
                }}
                className="input input-bordered w-full hover:input-primary focus:input-primary transition-colors"
              />
            </div>
            {showEmailSentText && (
              <div className="text-center max-w-md">
                Acabamos de enviarle un código de inicio de sesión temporal.<br/>Por favor revise su bandeja de entrada. <br/>¿No puede encontrarlo? <span className="text-primary cursor-pointer" onClick={() => setShowEmailSentText(false)}>Intentar otra vez</span>
              </div>
            )}
            <div className='flex flex-row w-full justify-end'>
            <button className="btn btn-block bg-white text-black hover:bg-gray-200 transition-all" onClick={handleCodeSubmit}>
              <Send size={24} className='mr-2' />
              Enviar código
            </button>
            </div>
          </div>
        ) : (
          <div className="form-control w-full max-w-full space-y-5">
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text">Correo</span>
              </label>
              <input
                type="email"
                placeholder="Dirección de correo"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(!validateEmail(e.target.value));
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleEmailSubmit();
                  }
                }}
                className={`input input-bordered w-full hover:input-primary focus:input-primary transition-colors ${emailError ? 'input-error focus:input-error' : ''}`}
              />
            </div>
            <button className="btn btn-full bg-white text-black hover:bg-gray-200 transition-all" onClick={handleEmailSubmit}>
              {loading ? <div>
                <svg aria-hidden="true" role="status" class="mr-2 inline h-5 w-5 animate-spin text-gray-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="rgb(0 0 0)"></path>
                </svg>
              </div> : null}
              {loading ? 'Cargando...' : <><Mail size={24} className="mr-2" /> Continuar con correo</>}
            </button>
          </div>
        )}
          <div className="divider">O</div>
          <a className="btn btn-full">
            <svg className="mr-2"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
            Continuar con Google
          </a>
      </div>
    </section>
  );
}

export default LoginForm;
