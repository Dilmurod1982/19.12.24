import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function RootLayouts() {
  return (
    <>
      <div className="fixed w-full mb-10 z-[5]">
        <Navbar />
      </div>

      <main className="pt-24">
        <Outlet />
      </main>
    </>
  );
}
