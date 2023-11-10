import React, { useState, useRef } from 'react';
import { Mail } from 'lucide-react';
import { signInWithEmail, signInWithGoogle } from "@lib/auth";
import { SpinnerAnimation, GoogleIcon } from '@components/Utils';
import PasswordInput from '@components/PasswordInput';
import Cookies from 'js-cookie';



function LoginForm() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [showEmailSentText, setShowEmailSentText] = useState(false);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);


    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const handleEnterPress = async (e) => {
        if (e.key === 'Enter') {
            if (emailInputRef.current === document.activeElement) {
                passwordInputRef.current.focus();
            } else if (passwordInputRef.current) {
                handleEmailSubmit();
            }
        }
    }

    const validateEmail = (email) => {
        if (!email || email.trim() === '') return false;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    };

    const validatePassword = (password) => {
        return password.trim() !== '';
    };

    const handleEmailSubmit = async () => {
        "use server";
        if (!validateEmail(email)) {
            setErrors({ ...errors, email: 'El formato de correo es inválido' });
            setEmailError(true);
            return;
        }

        if (!validatePassword(password)) {
            setErrors({ ...errors, password: 'Debe ingresar una contraseña' });
            setPasswordError(true);
            return;
        }

        try {
            setLoadingLogin(true);
            setErrors({ email: '', password: '' });
            const { auth, error } = await signInWithEmail(email, password);
            if (auth) {
                setLoadingLogin(false);
                setShowEmailSentText(true);
                const accessToken = auth.session.access_token;
                const expiresInSeconds = auth.session.expires_in;
                Cookies.set('sbat', accessToken, { expires: expiresInSeconds / 86400 });
                if (auth.user.user_metadata.onboarding) {
                    window.location.href = '/home';
                } else {
                    window.location.href = '/onboarding';
                }
            } else if (error) {
                setLoadingLogin(false);

                console.error("Error al iniciar sesión:", error);
            }
        } catch (error) {
            setLoadingLogin(false);
            setErrors({ ...errors, email: 'El correo o la contraseña son incorrectos', password: '' });
            console.error("Error al iniciar sesión:", error);
        }
    };

    const handleGoogleSubmit = async () => {
        setLoadingGoogle(true);
        await signInWithGoogle();
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
                                value={password} // You may want to change this to 'code'
                                onChange={(e) => {
                                    setPassword(e.target.value); // You may want to change this to 'setCode'
                                }}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        handleEmailSubmit();
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
                            <button className="btn btn-block bg-white text-black hover:bg-gray-200 transition-all" onClick={handleEmailSubmit}>
                                <Mail size={24} className='mr-2' />
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
                                    </span >
                                )}
                            </label>
                            <input
                                type="email"
                                placeholder="Dirección de correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyUp={handleEnterPress}
                                ref={emailInputRef}
                                className={`input input-bordered w-full hover:input-primary focus:input-primary transition-colors ${errors.email ? 'input-error focus:input-error' : ''}`}
                            />
                        </div>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                            onKeyUp={handleEnterPress}
                            ref={passwordInputRef}

                        />

                        <button className="btn btn-full bg-white text-black hover:bg-gray-200 transition-all" onClick={handleEmailSubmit}>
                            {loadingLogin ? <div>
                                <SpinnerAnimation />
                            </div> : null}
                            {loadingLogin ? 'Cargando...' : <><Mail size={24} className="mr-2" /> Entrar Con Correo</>}
                        </button>
                    </div>
                )}
                <div className="divider">O</div>
                <button className="btn btn-full" onClick={handleGoogleSubmit}>
                    {loadingGoogle ? <div>
                        <SpinnerAnimation />
                    </div> : null}
                    {loadingGoogle ? 'Cargando...' : <><GoogleIcon /> Entrar con Google</>}
                </button>
            </div>
        </section >
    );
}

export default LoginForm;
