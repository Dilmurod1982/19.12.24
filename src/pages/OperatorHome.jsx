import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDocs, getStations, refreshToken } from "../request";
import { useAppStore } from "../lib/zustand";
import { useTokenValidation } from "../hooks/useTokenValidation";

export default function OperatorHome() {
  const [sendingData, setSendingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const navigate = useNavigate();

  const setSmazka = useAppStore((state) => state.setSmazka);

  useTokenValidation(() => getDocs(user?.access_token, "smazka"), setSmazka);

  useEffect(() => {
    setIsLoading(true); // Включаем загрузку при начале запроса

    getStations(user?.access_token)
      .then(({ data }) => {
        setStations(data);
      })
      .catch((error) => {
        if (error.message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getStations(access_token);
            })
            .then(({ data }) => {
              setStations(data);
            })
            .catch((error) => console.error("Error fetching stations:", error));
        }
      })
      .finally(() => {
        setIsLoading(false); // Выключаем загрузку когда запрос завершен
      });
  }, [user, setStations, setUser, sendingData]);

  const filteredStations =
    stations?.filter((station) =>
      station.operators.includes(user?.id.toString())
    ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-xl">Маълумотлар юкланмоқда... Сабр</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <p>
        {user.surname} оператор{" "}
        {filteredStations.length > 0
          ? filteredStations[0].moljal
          : "нет станций"}
      </p>
      <div className="flex flex-col gap-3 items-center">
        <p>
          <Link to="/dailyreports" className="btn btn-neutral text-2xl">
            Кунлик ҳисоботлар
          </Link>
        </p>
        <p>
          <Link to="/jurinfo" className="btn btn-neutral text-2xl">
            Шартномалар қарздорлиги
          </Link>
        </p>
      </div>
    </div>
  );
}
