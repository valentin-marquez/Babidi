import React, { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Transition } from "@headlessui/react";
import Cookies from "js-cookie";
import { signOut } from "@lib/auth";

export function Logo() {
  const isLocalStorageAvailable = typeof localStorage !== "undefined";
  const [theme, setTheme] = useState("darken");

  const themes = {
    darken: "/images/logo/logo-dark.svg",
    light: "/images/logo/logo-light.svg",
  };

  useEffect(() => {
    if (isLocalStorageAvailable) {
      const storedTheme = localStorage.getItem("theme");
      setTheme(storedTheme || "darken");
    }
  }, [isLocalStorageAvailable]);

  useEffect(() => {
    if (isLocalStorageAvailable) {
      localStorage.setItem("theme", theme);
      // Emitir el evento "themeChange" después de actualizar el tema
      const themeChangeEvent = new CustomEvent("themeChange", {
        detail: theme,
      });
      window.dispatchEvent(themeChangeEvent);
    }
  }, [theme, isLocalStorageAvailable]);

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setTheme(event.detail);
    };

    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  return (
    <a href="/" className="btn btn-ghost text-base sm:text-xl">
      <img
        src={themes[theme]}
        alt="Babidi"
        className="h-auto w-24 sm:h-auto sm:w-48"
        decoding="async"
      />
      <span className="sr-only">Babidi Logo</span>
    </a>
  );
}

interface SpinnerAnimationProps {
  styles?: string;
}

export function SpinnerAnimation({
  styles = "mr-2 inline h-5 w-5 animate-spin text-gray-400",
}: SpinnerAnimationProps) {
  return (
    <svg
      aria-hidden="true"
      role="status"
      className={styles}
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      ></path>
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
interface CompletionAnimationProps {
  slug: string;
}

export const CompletionAnimation: React.FC<CompletionAnimationProps> = ({
  slug,
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 rounded-lg">
      <h2 className="font-syne text-2xl font-bold text-current">
        ¡Objeto Publicado!
      </h2>
      <a
        href={`/post/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center space-x-2"
      >
        <h2 className=" link link-primary cursor-pointer font-sora text-xl no-underline">
          Ver publicación!
        </h2>
      </a>
    </div>
  );
};

export const DoubleSpinner: React.FC = () => {
  return (
    <div>
      <span className="relative inset-0 inline-flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-base-300 after:absolute after:h-8 after:w-8 after:rounded-full after:border-2 after:border-x-transparent after:border-y-primary"></span>
    </div>
  );
};
export function GoogleIcon() {
  return (
    <svg
      className="mr-2"
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
  );
}

export const Hamburger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex-none" onClick={toggleMenu}>
      <label className="btn btn-square btn-ghost" htmlFor="sidebar">
        <div className="swap swap-rotate">
          <input type="checkbox" id="toggleMenu" />
          <Transition
            show={!isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu className=" h-6 w-6 fill-current" id="showMenu" />
          </Transition>

          <Transition
            show={isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <X className=" h-6 w-6 fill-current" id="closeMenu" />
          </Transition>
        </div>
      </label>
    </div>
  );
};

export const SignOut: React.FC = () => {
  const deleteAllCookies = () => {
    const cookies = Cookies.get();
    for (const cookie in cookies) {
      Cookies.remove(cookie);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    deleteAllCookies();
    window.location.href = "/";
  };

  return (
    <li onClick={handleSignOut} className="group">
      <a className="btn btn-md btn-wide m-0 items-center justify-start font-normal group-hover:font-semibold">
        <LogOut className="transition-colors group-hover:stroke-primary" />
        <span className="group-hover:brightness-125">Cerrar Sesión</span>
      </a>
    </li>
  );
};
