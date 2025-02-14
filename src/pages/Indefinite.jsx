import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "../lib/zustand";
import { fetchDataWithTokenRefresh, getDocs } from "../request";

function Indefinite() {
  const user = useAppStore((state) => state.user);
  const setStations = useAppStore((state) => state.setStations);
  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "stations"),
      setStations,
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setStations]);

  return (
    <div className="flex flex-col justify-center items-center gap-5 w-full">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">Хужжатлар рўйхати</h1>
      </div>
      <ul className="flex flex-col justify-center items-center gap-3 w-[600px]">
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/hokim"
          >
            1. Хоким қарорлари
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/contract"
          >
            2. Олди-сотди шартномалари
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/apz"
          >
            3. Архитектура режалаштириш топшириғи (АПЗ)
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/gastx"
          >
            4. Табиий газни техник шартлари
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/elektrtx"
          >
            5. Электр энергиясининг техник шартлари
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/suvtx"
          >
            6. Сувнинг техник шартлари
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/gasloyiha"
          >
            7. Ташқи газ тармоғининг лойиҳаси
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/elektrloyiha"
          >
            8. Электр тармоғини лойиҳаси
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/suvloyiha"
          >
            9. Сув тармоғини лойиҳаси
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/inshloyiha"
          >
            10. Заправка тўлиқ лойиҳаси
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/inshexpertiza"
          >
            11. Заправка тўлиқ лойиҳаси экспертизаси
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/prodexpertiza"
          >
            12. Саноат экспертизаси
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/iden"
          >
            13. Индентификация
          </Link>
        </li>
        <li className=" flex justify-center items-center w-full">
          <Link
            className=" w-full text-center text-xl btn btn-neutral text-white"
            to="/foyda"
          >
            14. Фойдаланишга қабул қилиш далолатномалари
          </Link>
        </li>
      </ul>
      <div>
        <button className="btn btn-outline">
          <Link to="/">Орқага</Link>
        </button>
      </div>
    </div>
  );
}

export default Indefinite;
