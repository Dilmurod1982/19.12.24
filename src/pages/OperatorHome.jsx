import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStations } from "../request";
import { useAppStore } from "../lib/zustand";

export default function OperatorHome() {
  const [sendingData, setSendingData] = useState(null);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const navigate = useNavigate();

  useEffect(() => {
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
              console.log("Stations after refresh:", data);
              setStations(data);
            })
            .catch((error) => console.error("Error fetching stations:", error));
        }
      });
  }, [user, setStations, setUser, sendingData]);

  const filteredStations = stations?.filter((station) =>
    station.operators.includes(user?.id.toString())
  );

  return (
    <div className="flex flex-col justify-center items-center">
      <p>
        {user.surname} оператор{" "}
        {filteredStations.length > 0
          ? filteredStations[0].moljal
          : "нет станций"}
      </p>
      <p>
        <Link to="/dailyreports" className="btn btn-neutral text-2xl">
          Кунлик ҳисоботлар
        </Link>
      </p>
    </div>
  );
}
