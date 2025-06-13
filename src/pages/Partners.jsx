import React from "react";
import { Link } from "react-router-dom";
import { useTokenValidation } from "../hooks/useTokenValidation";
import { useAppStore } from "../lib/zustand";
import { getDocs } from "../request";

export default function Partners() {
  const setSmazka = useAppStore((state) => state.setSmazka);

  useTokenValidation(() => getDocs(user?.access_token, "smazka"), setSmazka);

  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <div>
        <p>Ташкилотлар бўйича ҳисоботлар</p>
      </div>
      <div className="flex flex-col justify-center items-center gap-5">
        <ul className="flex flex-col justify-center items-center gap-5">
          <li>
            <Link to="/partnerslist" className="btn btn-neutral">
              Ташкилотлар рўйхати
            </Link>
          </li>
          <li>
            <Link to="/jurinfo" className="btn btn-neutral">
              Ташкилотлар қарздорлиги
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
