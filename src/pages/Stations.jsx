import StationsList from "../components/StationsList";
import AddNewStation from "../components/AddNewStation";
import { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import {
  getStations,
  getLtd,
  refreshToken,
  getRegions,
  getCities,
} from "../request";
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
  const regions = useAppStore((state) => state.regions);
  const setRegions = useAppStore((state) => state.setRegions);
  const cities = useAppStore((state) => state.cities);
  const setCities = useAppStore((state) => state.setCities);

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

  useEffect(() => {
    getRegions(user?.access_token)
      .then(({ data }) => {
        setRegions(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getRegions(access_token);
            })
            .then(({ data }) => setRegions(data))
            .catch((error) => console.error("Error fetching users:", error));
        }
      });
  }, [user, setRegions, setUser]);

  useEffect(() => {
    getCities(user?.access_token)
      .then(({ data }) => {
        setCities(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getCities(access_token);
            })
            .then(({ data }) => setCities(data))
            .catch((error) => console.error("Error fetching users:", error));
        }
      });
  }, [user, setCities, setUser]);

  const getLtdNameById = (id) => {
    const ltdItem = ltd?.find((item) => item.id === id);
    return ltdItem ? ltdItem.ltd_name : "Номаълум";
  };
  const getRegionsNameById = (id) => {
    const regionsItem = regions?.find((item) => item.id === id);
    return regionsItem ? regionsItem.region_name : "Номаълум";
  };
  const getCityNameById = (id) => {
    const cityItem = cities?.find((item) => item.id === id);
    return cityItem ? cityItem.city_name : "Номаълум";
  };
  const getGasLtdNameById = (id) => {
    const gasLtdItem = cities?.find((item) => item.id === id);
    return gasLtdItem ? gasLtdItem.city_name : "Номаълум";
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between mx-5 mb-8">
          <h1 className="text-3xl font-bold">Шахобчалар рўйхати</h1>
          {user.type === "admin" ? (
            <Button
              onClick={setAddItemModal}
              disabled={stations ? false : true}
              className={stations ? "cursor-pointer" : "cursor-not-allowed"}
            >
              Шахобча қўшиш
            </Button>
          ) : (
            ""
          )}
        </div>

        <table className="table table-xs">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Шахобча номи</th>
              <th className="text-center">МЧЖ номи ва рақми</th>
              <th className="text-center">Бошқарувчи ва телефони</th>
              <th className="text-center">Манзили</th>
              <th className="text-center">Бошқа механик ва телефони</th>
              <th className="text-center">Газ таъминот ташкилоти</th>
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
                  region_id,
                  city_id,
                  kocha,
                  uy,
                  boshqaruvchi,
                  aloqa_tel,
                  b_mexanik,
                  b_mexanik_tel,
                  gasLtd_id,
                }) => (
                  <StationsList
                    key={id}
                    id={id}
                    moljal={moljal}
                    ltd_name={getLtdNameById(ltd_id)} // Передача имени МЧЖ
                    station_number={station_number}
                    region_name={getRegionsNameById(region_id)}
                    city_name={getCityNameById(city_id)}
                    kocha={kocha}
                    uy={uy}
                    boshqaruvchi={boshqaruvchi}
                    aloqa_tel={aloqa_tel}
                    b_mexanik={b_mexanik}
                    b_mexanik_tel={b_mexanik_tel}
                    gasLtd_name={getGasLtdNameById(gasLtd_id)}
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
