import React, { useEffect, useState, useRef } from "react";

import { ChevronRight, LogOut, Settings } from "lucide-react";
import ThemeSwitch from "@components/ThemeSwitch.astro";

function Drawer({ profile, children }) {
  const drawerRef = useRef(null);
  const checkboxRef = useRef(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    const checkbox = checkboxRef.current;

    function toggleSidebar(status) {
      drawer.classList.toggle("drawer-open", status);
    }

    function setActiveLink() {
      const currentPath = window.location.pathname;
      const links = document.querySelectorAll(".menu a");

      links.forEach((link) => {
        const linkPath = link.getAttribute("href");

        if (linkPath && currentPath.includes(linkPath)) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }

    setActiveLink();

    checkbox.addEventListener("change", function (e) {
      toggleSidebar(e.target.checked);
    });

    window.addEventListener("popstate", setActiveLink);

    return () => {
      checkbox.removeEventListener("change", function (e) {
        toggleSidebar(e.target.checked);
      });

      window.removeEventListener("popstate", setActiveLink);
    };
  }, []);

  return (
    <>
      {profile ? (
        <div className="drawer" id="drawer" ref={drawerRef}>
          <input type="checkbox" className="drawer-toggle" ref={checkboxRef} />
          <div className="drawer-content flex transform flex-col transition-transform duration-300 ease-in-out">
            <main className="-z-10">{children}</main>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-3"
              aria-label="close sidebar"
              className="drawer-overlay"
            />
            <ul className="w-25 menu min-h-full overflow-y-auto border-opacity-50 bg-base-200 font-sora text-base-content shadow-lg">
              <h2 className="menu-title flex items-center gap-4 px-1.5 font-syne">
                General
              </h2>
              <div className="active-primary">
                <li>
                  <a href="/home" target="_self">
                    <ChevronRight />
                    <span>Inicio</span>
                  </a>
                </li>
                <li>
                  <a href="/explore">
                    <ChevronRight />
                    <span>Explorar Intercambios</span>
                  </a>
                </li>
                <li>
                  <a href="/exchanges">
                    <ChevronRight />
                    <span>Mis Articulos</span>
                  </a>
                </li>
                <li>
                  <a>
                    <ChevronRight />
                    Mensajes
                  </a>
                </li>
              </div>
              <div className="divider" />
              <li>
                <div className="avatar placeholder">
                  <div className="w-10 rounded-full bg-neutral text-neutral-content">
                    <span className="text-sm">{profile.initials}</span>
                  </div>
                  <span>
                    <div className="flex flex-col">
                      <p className="capitalize">{profile.full_name}</p>
                      <p className="capitalize">@{profile.username}</p>
                    </div>
                  </span>
                </div>
              </li>
              <div className="divider" />
              <h2 className="menu-title flex items-center gap-4 px-1.5 font-syne">
                Cuenta
              </h2>
              <li>
                <a>
                  <Settings className="font-normal" />
                  Configuración
                </a>
              </li>
              <li>
                <a>
                  <LogOut className="font-normal" />
                  Cerrar Sesión
                </a>
              </li>
              <li>
                <ThemeSwitch />
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="drawer-content flex transform flex-col transition-transform duration-300 ease-in-out">
          <main>{children}</main>
        </div>
      )}
    </>
  );
}

export default Drawer;
