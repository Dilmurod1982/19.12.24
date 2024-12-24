import StationsList from "../components/StationsList";
import AddNewStation from "../components/AddNewStation";
import { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import { getStations, getLtd, refreshToken } from "../request";
import { Button } from "../components/ui/button";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";

function Stations() {
  const [sendingData, setSendingData] = useState(null);
  const stations = useAppStore((state) => state.stations);
  const setStations = useAppStore((state) => state.setStations);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const ltd = useAppStore((state) => state.ltd);
  const setLtd = useAppStore((state) => state.setLtd);

  useEffect(() => {
    getStations(user?.access_token)
      .then(({ data }) => {
        setStations(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getStations(access_token);
            })
            .then(({ data }) => setStations(data))
            .catch((error) => console.error("Error fetching users:", error));
        }
      });
  }, [user, setStations, setUser, sendingData]);

  useEffect(() => {
    getLtd(user?.access_token)
      .then(({ data }) => {
        setLtd(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getLtd(access_token);
            })
            .then(({ data }) => setLtd(data))
            .catch((error) => console.error("Error fetching users:", error));
        }
      });
  }, [user, setLtd, setUser]);

  const getLtdNameById = (id) => {
    const ltdItem = ltd?.find((item) => item.id === id);
    return ltdItem ? ltdItem.ltd_name : "Номаълум";
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between mx-5 mb-8">
          <h1 className="text-3xl font-bold">Шахобчалар рўйхати</h1>

          <Button
            onClick={setAddItemModal}
            disabled={stations ? false : true}
            className={stations ? "cursor-pointer" : "cursor-not-allowed"}
          >
            Шахобча қўшиш
          </Button>
        </div>

        <table className="table table-xs">
          <thead>
            <tr>
              <th>#</th>
              <th>Шахобча номи</th>
              <th>МЧЖ номи ва рақми</th>
              <th>Бошқарувчи ва телефони</th>
              <th>Манзили</th>
              <th>Бошқа механик ва телефони</th>
              <th>Газ таъминот ташкилоти</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stations ? (
              stations.map(
                ({
                  id,
                  moljal,
                  ltd_id,
                  station_number,
                  viloyat,
                  tuman,
                  kocha,
                  uy,
                  boshqaruvchi,
                  aloqa_tel,
                  b_mexanik,
                  b_mexanik_tel,
                  gaz_taminot,
                }) => (
                  <StationsList
                    key={id}
                    id={id}
                    moljal={moljal}
                    ltd_name={getLtdNameById(ltd_id)} // Передача имени МЧЖ
                    station_number={station_number}
                    viloyat={viloyat}
                    tuman={tuman}
                    kocha={kocha}
                    uy={uy}
                    boshqaruvchi={boshqaruvchi}
                    aloqa_tel={aloqa_tel}
                    b_mexanik={b_mexanik}
                    b_mexanik_tel={b_mexanik_tel}
                    gaz_taminot={gaz_taminot}
                  />
                )
              )
            ) : (
              <tr>
                <td colSpan="3">
                  <div className="flex w-full mt-10 mb-10 justify-end items-center">
                    <PulseLoader speedMultiplier={0.5} />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddNewStation
        sendingData={sendingData}
        setSendingData={setSendingData}
      />
      <div className="flex w-full h-screen justify-center mt-5">
        <Button>
          <Link to="/">Орқага</Link>
        </Button>
      </div>
    </>
  );
}

export default Stations;
