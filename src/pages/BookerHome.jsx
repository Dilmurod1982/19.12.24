import React from "react";
import { useAppStore } from "../lib/zustand";
import { Link } from "react-router-dom";

export default function BookerHome() {
  const user = useAppStore((state) => state.user);
  return (
    <div className="flex justify-center items-center">
      <ul className="flex flex-col gap-5">
        <li className="w-full">
          <Link
            to="/userstations"
            className="btn btn-outline  text-2xl font-bold w-full"
          >
            Шахобчалар
          </Link>
        </li>
        <li>
          <Link
            to="/reports"
            className="btn btn-outline  text-2xl font-bold w-full"
          >
            Ҳисоботлар
          </Link>
        </li>
      </ul>
    </div>
  );
}
