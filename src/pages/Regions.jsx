import { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import { getRegions, refreshToken } from "../request";
import { Button } from "../components/ui/button";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";

import RegionsList from "../components/RegionsList";
import AddNewRegion from "../components/AddNewRegion";

function Regions() {
  const [sendingData, setSendingData] = useState(null);
  const regions = useAppStore((state) => state.regions);

  const setRegions = useAppStore((state) => state.setRegions);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);

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
  }, [user, setRegions, setUser, sendingData]);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between mx-5 mb-8">
          <h1 className="text-3xl font-bold">Вилоятлар рўйхати</h1>
          {user.type === "admin" ? (
            <Button
              onClick={setAddItemModal}
              disabled={regions ? false : true}
              className={regions ? "cursor-pointer" : "cursor-not-allowed"}
            >
              Вилоят қўшиш
            </Button>
          ) : (
            ""
          )}
        </div>

        <table className="table table-xs">
          <thead>
            <tr>
              <th>#</th>
              <th>Вилоят номи</th>
            </tr>
          </thead>
          <tbody>
            {regions ? (
              regions.map(({ id, region_name }) => (
                <RegionsList key={id} id={id} region_name={region_name} />
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
      <AddNewRegion sendingData={sendingData} setSendingData={setSendingData} />
      <div className="flex w-full h-screen justify-center mt-5">
        <Button>
          <Link to="/">Орқага</Link>
        </Button>
      </div>
    </>
  );
}

export default Regions;
