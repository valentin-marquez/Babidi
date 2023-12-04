import React, { useState, useEffect } from "react";
import { User, Plus } from "lucide-react";
import { SpinnerAnimation } from "@components/Utils";

interface IEditProfileProps {
  user: any;
  action: string;
  method: string;
  cookie: string;
}

interface UserProfile {
  user_id: string;
  full_name: string;
  username: string;
  bio: string;
  avatar: string;
}

export default function EditProfile({
  user: UserProfile,
  action,
  method,
  cookie,
}) {
  const [user, setUser] = useState({
    id: UserProfile.user_id,
    fullName: UserProfile.full_name,
    username: UserProfile.username,
    bio: UserProfile.bio,
    avatar: UserProfile.avatar,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const fileInputRef = React.useRef();

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 1000); // 1000ms = 1s

      // Cleanup function to clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUser({
      ...user,
      avatar: file,
    });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const sbat = cookie;

    const formData = new FormData();

    Object.keys(user).forEach((key) => {
      if (key !== "avatar") {
        formData.append(key, user[key]);
      }
    });

    if (user.avatar) {
      formData.append("avatar", user.avatar, `avatar-${user.username}`);
    }

    const response = await fetch(action, {
      method,
      headers: {
        Authorization: `${sbat}`,
      },
      body: formData,
    });

    if (response.ok) {
      // handle successful response
      setToastType("success");
      setToastMessage("Perfil Actualizado Exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      // handle error response
      setToastType("error");
      setToastMessage("Error Actualizando el perfil");
    }
    setIsLoading(false);
    setIsClicked(false);
  };

  return (
    <div className="mx-auto  rounded-lg font-sora lg:flex lg:flex-col lg:items-center">
      {isLoading && <SpinnerAnimation />}
      {toastMessage && (
        <div className="toast absolute">
          <div
            className={`alert ${
              toastType == "error" ? "alert-error" : "alert-success"
            }`}
          >
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <div className="flex w-11/12 max-w-5xl flex-col items-center">
        <div
          className="relative mb-4 flex rounded-full p-2 hover:cursor-pointer"
          onClick={handleFileClick}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {previewImage ? (
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                <img src={previewImage} />
              </div>
            </div>
          ) : (
            <div className="avatar placeholder mb-4">
              <div className="w-24 rounded-full bg-primary text-neutral-content ring ring-primary ring-offset-2 ring-offset-base-200">
                {user.avatar ? (
                  <img src={user.avatar} />
                ) : (
                  <span className="select-none text-2xl text-white">
                    {UserProfile.full_name
                      .split(" ")
                      .map((n) => n && n[0])
                      .join("")
                      .toLocaleUpperCase()}
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="absolute bottom-1 right-1 rounded-full bg-primary p-1">
            <Plus className="text-white" />
          </div>
        </div>
        <div className="rounded-lg bg-base-300 p-6 lg:w-full">
          <form
            onSubmit={handleSubmit}
            className="form-control w-full"
            method="POST"
          >
            <div className="mb-4">
              <div className="label">
                <span className="label-text text-sm font-semibold">
                  Nombre de usuario
                </span>
              </div>
              <input
                id="username"
                name="username"
                value={user.username}
                onChange={handleChange}
                type="text"
                className="input input-bordered input-primary w-full max-w-xs md:max-w-full"
                autoComplete="off"
              />
            </div>
            <div className="mb-6">
              <div className="label">
                <span className="label-text text-sm font-semibold">
                  Descripción
                </span>
              </div>
              <textarea
                className="textarea textarea-bordered textarea-primary w-full max-w-xs whitespace-pre-wrap md:max-w-full"
                maxLength={500}
                id="bio"
                name="bio"
                value={user.bio}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className={`btn btn-primary btn-active w-full max-w-xs md:max-w-full ${
                  isClicked ? "btn-disabled" : ""
                }`}
                disabled={isClicked}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
