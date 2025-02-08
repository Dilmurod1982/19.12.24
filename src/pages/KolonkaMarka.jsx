import { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import { getKolonkamarka, getRegions, refreshToken } from "../request";
import { Button } from "../components/ui/button";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";

import RegionsList from "../components/RegionsList";
import AddNewRegion from "../components/AddNewRegion";
import KolonkaMarkaList from "../components/KolonkaMarkaList";
import AddNewKolonkamarka from "../components/AddNewKolonkamarka";

function KolonkaMarka() {
  const [sendingData, setSendingData] = useState(null);
  const kolonkamarka = useAppStore((state) => state.kolonkamarka);

  const setKolonkamarka = useAppStore((state) => state.setKolonkamarka);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);

  useEffect(() => {
    getKolonkamarka(user?.access_token)
      .then(({ data }) => {
        setKolonkamarka(data);
      })
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getKolonkamarka(access_token);
            })
            .then(({ data }) => setKolonkamarka(data))
            .catch((error) => console.error("Error fetching users:", error));
        }
      });
  }, [user, setKolonkamarka, setUser, sendingData]);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between mx-5 mb-8">
          <h1 className="text-3xl font-bold">Колонка маркаси рўйхати</h1>
          {user.type === "admin" ? (
            <Button
              onClick={setAddItemModal}
              disabled={kolonkamarka ? false : true}
              className={kolonkamarka ? "cursor-pointer" : "cursor-not-allowed"}
            >
              Колонка турини қўшиш
            </Button>
          ) : (
            ""
          )}
        </div>

        <table className="table table-xs">
          <thead>
            <tr>
              <th>#</th>
              <th>Колонка тури номи</th>
            </tr>
          </thead>
          <tbody>
            {kolonkamarka ? (
              kolonkamarka.map(({ id, type_name }) => (
                <KolonkaMarkaList key={id} id={id} type_name={type_name} />
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
      <AddNewKolonkamarka
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

export default KolonkaMarka;
