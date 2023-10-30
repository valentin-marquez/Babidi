import React, { useState, useEffect } from 'react';
import { Logo, getCookie } from "@components/Utils";
import { getUser, signOut } from '@lib/auth';
import Cookies from 'js-cookie';

function OnboardingForm() {
    const [fullName, setFullName] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [isOver18, setIsOver18] = useState(true);
    const [acceptTerms, setAcceptTerms] = useState(true);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [errors, setErrors] = useState({
        fullName: '',
        nickname: '',
        general: '',
    });

    useEffect(() => {
        async function fetchUser() {
            try {
                const result = await getUser(Cookies.get('sbat'));
                const userEmail = result?.user?.email;
                setEmail(userEmail || '');
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        setLatitude(position.coords.latitude);
                        setLongitude(position.coords.longitude);
                    });
                }
            } catch (error) {
                console.error("Ocurrió un error:", error);
                await signOut();
                window.location.href = '/login';
            }
        }

        fetchUser();
    }, []);

    const handleLoginWithAnotherEmail = async () => {
        // Clear any previous errors
        setErrors({
            fullName: '',
            nickname: '',
            general: '',
        });

        // Delete the cookie
        Cookies.remove('sbat');

        // Sign out
        await signOut();

        // Redirect to login page
        window.location.href = '/login';
    }

    const handleFormSubmit = async () => {
        // Clear any previous errors
        setErrors({
            fullName: '',
            nickname: '',
            general: '',
        });

        if (!fullName.trim()) {
            setErrors({ ...errors, fullName: 'Ingrese su nombre completo' });
            return;
        }

        if (!nickname.trim()) {
            setErrors({ ...errors, nickname: 'Ingrese su apodo' });
            return;
        }

        if (!isOver18) {
            setErrors({ ...errors, general: 'Debe ser mayor de 18 años' });
            return;
        }

        if (!acceptTerms) {
            setErrors({
                ...errors,
                general: 'Debe aceptar los términos y condiciones',
            });
            return;
        }
    };

    return (
        <section className="flex flex-col items-center lg:space-y-5 min-h-screen inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
            <Logo />
            <h2 className="text-white text-3xl lg:text-3xl font-bold font-syne lg:max-w-4xl drop-shadow-lg">
                Bienvenido a tu cuenta
            </h2>
            {/* @ts-ignore */}
            <p className="font-sora text-center" style={{ textWrap: 'balance' }}>
                Antes que nada, <br />Cuéntanos un poco sobre ti
            </p>
            <div className="form-control max-w-full md:w-1/4 space-y-2 w-3/5">
                <div className="container">
                    <label className="label">
                        <span className="label-text font-sora">Nombre Completo</span>
                    </label>
                    <input
                        type="text"
                        className={`input input-bordered w-full hover:input-primary focus:input-primary transition-colors ${errors.fullName ? 'input-error focus:input-error' : ''
                            }`}
                        placeholder="Michael Jordan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    {errors.fullName && (
                        <span className="label-text-alt text-error">{errors.fullName}</span>
                    )}
                </div>
                <div className="container">
                    <label className="label">
                        <span className="label-text font-sora">Como quieres que te digamos?</span>
                    </label>
                    <input
                        type="text"
                        className={`input input-bordered w-full hover:input-primary focus:input-primary transition-colors ${errors.nickname ? 'input-error focus:input-error' : ''
                            }`}
                        placeholder="e.g. Air Jordan, M.J."
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    {errors.nickname && (
                        <span className="label-text-alt text-error">{errors.nickname}</span>
                    )}
                </div>
                <div className="container">
                    <label className="label cursor-pointer justify-start space-x-3">
                        <input
                            type="checkbox"
                            checked={isOver18}
                            className="checkbox checkbox-primary"
                            onChange={() => setIsOver18(!isOver18)}
                        />
                        <span className="label-text font-sora">Sí, tengo más de 18 años</span>
                    </label>
                </div>
                <div className="container">
                    <label className="label cursor-pointer space-x-3">
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            className="checkbox checkbox-primary"
                            onChange={() => setAcceptTerms(!acceptTerms)}
                        />
                        <span className="label-text font-sora">Acepta las Condiciones y la Política de Uso de Babidi</span>
                    </label>
                </div>
                {errors.general && (
                    <p className="label-text-alt text-center text-error">{errors.general}</p>
                )}
                <div className="container mt-5">
                    <button className="btn btn-primary w-full" onClick={handleFormSubmit}>
                        Continuar
                    </button>
                </div>
                <div className="container">
                    {/* @ts-ignore */}
                    <p className="label-text-alt text-center" style={{ textWrap: 'balance' }}>
                        Si no tiene intención de crear una nueva cuenta como <b>{email}</b> puede <button onClick={handleLoginWithAnotherEmail}><u>iniciar sesión con otro correo electrónico</u></button>.
                    </p>
                </div>
            </div>
        </section >
    );
}

export default OnboardingForm;
