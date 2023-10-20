import React, { useState } from 'react';
import { Send, Mail } from 'lucide-react';
import { verifyCode } from "@lib/auth"
import { SpinnerAnimation, GoogleIcon } from '@components/Utils';
import {signInWithEmail} from '@lib/auth';

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
        if (!email || email.trim() === "") {
            setEmailError(true);
            return;
        }

        if (!validateEmail(email)) {
            setEmailError(true);
            return;
        }


        try {
            setLoading(true);
            setEmailSent(true);
            const result = await signInWithEmail(email);
            console.log(result);
            if (result.user && result.session) {
                // Éxito en la autenticación
                setLoading(false);
                setShowEmailSentText(true);
            } else if (result.messageId) {
                // Se recibió un mensaje de error
                setLoading(false);
                console.error("Error al enviar el código de confirmación:", result.messageId);
            } else {
                // Resultado inesperado
                setLoading(false);
                console.error("Resultado inesperado al enviar el código de confirmación.");
            }
        } catch (error) {
            setLoading(false);
            console.error("Error al enviar el código de confirmación:", error);
        }
    };

    const handleCodeSubmit = async () => {
        try {
            await verifyCode(email, code);

            setLoading(false);

        } catch (error) {
            console.error("Error al verificar el código:", error);
        }
    }

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
                                Acabamos de enviarle un código de inicio de sesión temporal.<br />Por favor revise su bandeja de entrada. <br />¿No puede encontrarlo? <span className="text-primary cursor-pointer" onClick={() => setShowEmailSentText(false)}>Intentar otra vez</span>
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
                                <SpinnerAnimation/>
                            </div> : null}
                            {loading ? 'Cargando...' : <><Mail size={24} className="mr-2" /> Continuar con correo</>}
                        </button>
                    </div>
                )}
                <div className="divider">O</div>
                <a className="btn btn-full">
                    <GoogleIcon/>
                    Continuar con Google
                </a>
            </div>
        </section>
    );
}


export default LoginForm;