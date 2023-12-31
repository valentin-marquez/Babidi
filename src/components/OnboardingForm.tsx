import React, { useState, useEffect } from "react";
import { Logo } from "@components/Utils";
import { signOut, CreateUserProfile } from "@lib/auth";
import Cookies from "js-cookie";
import type { Profile } from "@lib/interfaces";

function OnboardingForm() {
  const [UserID, setUserID] = useState("");
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [isOver18, setIsOver18] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errors, setErrors] = useState({
    fullName: "",
    nickname: "",
    general: "",
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const sbat = Cookies.get("sbat");
        const response = await fetch(`/api/user/getUser`, {
          method: "POST",
          headers: new Headers({
            Authorization: `${sbat}`,
            "Content-Type": "application/json",
          }),
          credentials: "same-origin",
        });

        if (!response.ok) {
          console.log(response.status);
          console.log(response.statusText);
          throw new Error(response.statusText);
        }

        const { user } = await response.json();
        const userEmail = user?.email;
        setUserID(user?.id);
        setEmail(userEmail || "");
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          });
        }
      } catch (error) {
        console.error("Ocurrió un error:", error);
        await signOut();
        window.location.href = "/login";
      }
    }

    fetchUser();
  }, []);

  const handleLoginWithAnotherEmail = async () => {
    // Clear any previous errors
    setErrors({
      fullName: "",
      nickname: "",
      general: "",
    });

    // Delete the cookie
    Cookies.remove("sbat");

    // Sign out
    await signOut();

    // Redirect to login page
    window.location.href = "/login";
  };

  const handleFormSubmit = async () => {
    setErrors({
      fullName: "",
      nickname: "",
      general: "",
    });

    if (!fullName.trim() || fullName.split(" ").length < 2) {
      setErrors({ ...errors, fullName: "Ingrese su nombre completo" });
      return;
    }

    if (!nickname.trim()) {
      setErrors({ ...errors, nickname: "Ingrese su apodo" });
      return;
    }

    if (!isOver18) {
      setErrors({ ...errors, general: "Debe ser mayor de 18 años" });
      return;
    }

    if (!acceptTerms) {
      setErrors({
        ...errors,
        general: "Debe aceptar los términos y condiciones",
      });
      return;
    }

    const user: Profile = {
      id: UserID,
      fullName: fullName,
      username: nickname,
      email: email,
      avatar: "",
      bio: "",
      accepted_terms: acceptTerms,
      is_adult: isOver18,
      geometry: {
        latitude: latitude,
        longitude: longitude,
      },
      status: "ONLINE",
      token: Cookies.get("sbat"),
    };

    if (await CreateUserProfile(user)) {
      window.location.href = "/home";
    } else {
      setErrors({
        ...errors,
        general:
          "Ocurrió un error al crear su perfil. Inténtelo de nuevo más tarde.",
      });
    }
  };

  return (
    <section className="inset-0 flex h-full min-h-screen w-full flex-col items-center bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] lg:space-y-5">
      <Logo />
      <h2 className="font-syne text-3xl font-bold text-white drop-shadow-lg lg:max-w-4xl lg:text-3xl">
        Bienvenido a tu cuenta
      </h2>
      <p className="text-center font-sora" style={{ textWrap: "balance" }}>
        Antes que nada, <br />
        Cuéntanos un poco sobre ti
      </p>
      <div className="form-control w-3/5 max-w-full space-y-2 md:w-1/4">
        <div className="container">
          <label className="label">
            <span className="label-text font-sora">Nombre Completo</span>
          </label>
          <input
            type="text"
            className={`input input-bordered w-full transition-colors hover:input-primary focus:input-primary ${
              errors.fullName ? "input-error focus:input-error" : ""
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
            <span className="label-text font-sora">
              Como quieres que te digamos?
            </span>
          </label>
          <input
            type="text"
            className={`input input-bordered w-full transition-colors hover:input-primary focus:input-primary ${
              errors.nickname ? "input-error focus:input-error" : ""
            }`}
            placeholder="e.g. Air_Jordan, M_J"
            value={nickname}
            onChange={(e) => {
              let value = e.target.value.toLowerCase().replace(/\s/g, "_");
              value = value.replace(/[()"/]/g, "");
              setNickname(value);
            }}
            pattern="^[a-z][a-z0-9_]{0,14}$"
            required
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
              className="checkbox-primary checkbox"
              onChange={() => setIsOver18(!isOver18)}
            />
            <span className="label-text font-sora">
              Sí, tengo más de 18 años
            </span>
          </label>
        </div>
        <div className="container">
          <label className="label cursor-pointer space-x-3">
            <input
              type="checkbox"
              checked={acceptTerms}
              className="checkbox-primary checkbox"
              onChange={() => setAcceptTerms(!acceptTerms)}
            />
            <span className="label-text font-sora">
              Acepta las Condiciones y la Política de Uso de Babidi
            </span>
          </label>
        </div>
        {errors.general && (
          <p className="label-text-alt text-center text-error">
            {errors.general}
          </p>
        )}
        <div className="container mt-5">
          <button className="btn btn-primary w-full" onClick={handleFormSubmit}>
            Continuar
          </button>
        </div>
        <div className="container">
          <p
            className="label-text-alt text-center"
            style={{ textWrap: "balance" }}
          >
            Si no tiene intención de crear una nueva cuenta como <b>{email}</b>{" "}
            puede{" "}
            <button onClick={handleLoginWithAnotherEmail}>
              <u>iniciar sesión con otro correo electrónico</u>
            </button>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

export default OnboardingForm;
