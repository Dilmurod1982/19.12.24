import React from "react";
import { useAppStore } from "../lib/zustand";
import { Link } from "react-router-dom";
import { useTokenValidation } from "../hooks/useTokenValidation";
import { getDocs } from "../request";

export default function BookerHome() {
  const user = useAppStore((state) => state.user);

  const setSmazka = useAppStore((state) => state.setSmazka);

  useTokenValidation(() => getDocs(user?.access_token, "smazka"), setSmazka);

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
        <li>
          <Link
            to="/payment"
            className="btn btn-outline  text-2xl font-bold w-full"
          >
            Тўловлар
          </Link>
        </li>
      </ul>
    </div>
  );
}
