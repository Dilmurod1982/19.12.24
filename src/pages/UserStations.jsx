import React, { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import { getStations } from "../request";
import { PulseLoader } from "react-spinners";

function UserStations() {
  const [sendingData, setSendingData] = useState(null);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);

  console.log("Stations from store:", stations);

  useEffect(() => {
    getStations(user?.access_token)
      .then(({ data }) => {
        console.log("Stations data:", data);
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

  return (
    <div>
      <ul>
        {stations ? (
          stations.map((station) => {
            return <li key={station.id}>{station.moljal}</li>;
          })
        ) : (
          <div className="flex w-full mt-10 mb-10 justify-end items-center">
            <PulseLoader speedMultiplier={0.5} />
          </div>
        )}
      </ul>
    </div>
  );
}

export default UserStations;
