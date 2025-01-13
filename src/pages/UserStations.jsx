import React, { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import { getStations } from "../request";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";
import UserStationPage from "../components/UserStationPage";

function UserStations() {
  const [sendingData, setSendingData] = useState(null);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);

  const licenses = useAppStore((state) => state.licenses);
  const ngsertificates = useAppStore((state) => state.ngsertificates);
  const humidity = useAppStore((state) => state.humidity);
  const gasanalyzers = useAppStore((state) => state.gasanalyzers);
  const prodinsurance = useAppStore((state) => state.prodinsurance);
  const lifeinsurance = useAppStore((state) => state.lifeinsurance);
  const ecology = useAppStore((state) => state.ecology);
  const ik = useAppStore((state) => state.ik);

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
  //   console.log(
  //     "Лицензия",
  //     licenses,
  //     "сертификат соответвия:",
  //     ngsertificates,
  //     "Влагомер:",
  //     humidity,
  //     "Газ анализатор:",
  //     gasanalyzers,
  //     "Хавфли ишлаб чиыариш полиси:",
  //     prodinsurance,
  //     "Ходимлар полиси:",
  //     lifeinsurance,
  //     "Экология хулосаси:",
  //     ecology,
  //     "ИК:",
  //     ik
  //   );
  return (
    <div className="flex justify-center items-center gap-5">
      {filteredStations ? (
        filteredStations.map((station) => {
          return (
            <UserStationPage
              key={station.id}
              station={station}
              licenses={licenses}
              ngsertificates={ngsertificates}
              humidity={humidity}
              gasanalyzers={gasanalyzers}
              prodinsurance={prodinsurance}
              lifeinsurance={lifeinsurance}
              ecology={ecology}
              ik={ik}
            />
          );
        })
      ) : (
        <div className="flex w-full mt-10 mb-10 justify-end items-center">
          <PulseLoader speedMultiplier={0.5} />
        </div>
      )}
    </div>
  );
}

export default UserStations;
