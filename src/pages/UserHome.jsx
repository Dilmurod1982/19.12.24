import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/zustand";
import { fetchDataWithTokenRefresh, getDocs } from "../request";
import { toast } from "sonner";

function UserHome() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();

  const licenses = useAppStore((state) => state.licenses);
  const ngsertificates = useAppStore((state) => state.ngsertificates);
  const humidity = useAppStore((state) => state.humidity);
  const gasanalyzers = useAppStore((state) => state.gasanalyzers);
  const prodinsurance = useAppStore((state) => state.prodinsurance);
  const lifeinsurance = useAppStore((state) => state.lifeinsurance);
  const ecology = useAppStore((state) => state.ecology);
  const ik = useAppStore((state) => state.ik);
  const pilot = useAppStore((state) => state.pilot);
  const shayba = useAppStore((state) => state.shayba);
  const water = useAppStore((state) => state.water);
  const electric = useAppStore((state) => state.electric);
  const kolonka = useAppStore((state) => state.kolonka);
  const manometr = useAppStore((state) => state.manometr);
  const termometr = useAppStore((state) => state.termometr);
  const voltmetr = useAppStore((state) => state.voltmetr);
  const shlang = useAppStore((state) => state.shlang);
  const ppk = useAppStore((state) => state.ppk);
  const elprotec = useAppStore((state) => state.elprotec);
  const mol = useAppStore((state) => state.mol);
  const smazka = useAppStore((state) => state.smazka);
  const ger = useAppStore((state) => state.ger);
  const aptek = useAppStore((state) => state.aptek);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-center text-2xl font-bold">Фойдаланувчи сахифаси</h1>
      <div className="flex justify-center">
        <ul className="flex flex-col gap-2 w-96">
          <li>
            <Link
              className="btn btn-neutral text-xl w-full text-white"
              to="/userstations"
            >
              Шахобчалар
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserHome;
