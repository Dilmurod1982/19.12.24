import React, { useState } from "react";
import { useAppStore } from "../lib/zustand";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Navbar() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const [menuOpen, setMenuOpen] = useState(false); // Состояние для управления меню

  function logOut() {
    const checker = confirm("Ҳақиқатдан тизимдан чиқмочимисиз?");
    checker && setUser(null);
  }

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="navbar bg-base-100 shadow-md mb-6">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          АГТКШ
        </Link>
      </div>
      <ul className="menu menu-horizontal px-1">
        <li className="relative">
          <summary onClick={toggleMenu} className="btn btn-ghost">
            Маълумот
          </summary>
          {menuOpen && (
            <ul className="absolute left-0 top-full bg-white p-2 shadow z-40">
              {user.type === "admin" ? (
                <li>
                  <Link to="/users" onClick={closeMenu}>
                    Фойдаланувчилар
                  </Link>
                </li>
              ) : (
                ""
              )}

              <li>
                {user.type === "admin" ? (
                  <Link to="/regions" onClick={closeMenu}>
                    Вилоятлар
                  </Link>
                ) : (
                  ""
                )}
              </li>
              <li>
                {user.type === "admin" ? (
                  <Link to="/cities" onClick={closeMenu}>
                    Туманлар
                  </Link>
                ) : (
                  ""
                )}
              </li>
              <li>
                {user.type === "admin" ? (
                  <Link to="/ltd" onClick={closeMenu}>
                    МЧЖлар
                  </Link>
                ) : (
                  ""
                )}
              </li>
              <li>
                <Link to="/stations" onClick={closeMenu}>
                  Шахобчалар
                </Link>
              </li>
              <li>
                <Link to="/kolonkamarka" onClick={closeMenu}>
                  Колонкалар тури
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <h1>{user.username}</h1>
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
          >
            <div className="card-body">
              <span className="text-lg font-bold">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 mx-auto mt-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow gap-5"
          >
            <li>
              <Link
                className="flex justify-center text-slate-50 m-0 p-0 bg-slate-500 h-7"
                to="/profile"
              >
                Фойдаланувчи кабинети
              </Link>
            </li>

            <li>
              <Button onClick={logOut}>Чиқиш</Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
