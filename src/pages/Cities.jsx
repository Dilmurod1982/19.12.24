import StationsList from "../components/StationsList";
import AddNewStation from "../components/AddNewStation";
import { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import {
  getStations,
  getLtd,
  refreshToken,
  getCities,
  getRegions,
} from "../request";
import { Button } from "../components/ui/button";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";
import AddNewCity from "../components/AddNewCity";
import CitiesList from "../components/CitiesList";

function Cities() {
  const [sendingData, setSendingData] = useState(null);
  const cities = useAppStore((state) => state.cities);
  const setCities = useAppStore((state) => state.setCities);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);
  const regions = useAppStore((state) => state.regions);
  const setRegions = useAppStore((state) => state.setRegions);

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
  }, [user, setCities, setUser, sendingData]);

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

  const getRegionsNameById = (id) => {
    const regionItem = regions?.find((item) => item.id === id);
    return regionItem ? regionItem.region_name : "Номаълум";
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between mx-5 mb-8">
          <h1 className="text-3xl font-bold">Туман/шаҳар рўйхати</h1>
          {user.type === "admin" ? (
            <Button
              onClick={setAddItemModal}
              disabled={cities ? false : true}
              className={cities ? "cursor-pointer" : "cursor-not-allowed"}
            >
              Туман/шаҳар қўшиш
            </Button>
          ) : (
            ""
          )}
        </div>

        <table className="table table-xs">
          <thead>
            <tr>
              <th>#</th>
              <th>Туман/шаҳар номи</th>
              <th>вилоят номи</th>
            </tr>
          </thead>
          <tbody>
            {cities ? (
              cities.map(({ id, city_name, region_id }) => (
                <CitiesList
                  key={id}
                  id={id}
                  city_name={city_name}
                  region_name={getRegionsNameById(region_id)}
                  region_id={region_id}
                />
              ))
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
      <AddNewCity sendingData={sendingData} setSendingData={setSendingData} />
      <div className="flex w-full h-screen justify-center mt-5">
        <Button>
          <Link to="/">Орқага</Link>
        </Button>
      </div>
    </>
  );
}

export default Cities;
