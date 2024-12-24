import { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import { getLtd, refreshToken } from "../request";
import { Button } from "../components/ui/button";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";
import AddNewLtd from "../components/AddNewLtd";
import LtdList from "../components/LtdList";

function Ltd() {
  const [sendingData, setSendingData] = useState(null);
  const ltd = useAppStore((state) => state.ltd);
  console.log(ltd);
  const setLtd = useAppStore((state) => state.setLtd);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);

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
  }, [user, setLtd, setUser, sendingData]);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between mx-5 mb-8">
          <h1 className="text-3xl font-bold">Фойдаланувчилар рўйхати</h1>

          <Button
            onClick={setAddItemModal}
            disabled={ltd ? false : true}
            className={ltd ? "cursor-pointer" : "cursor-not-allowed"}
          >
            МЧЖ қўшиш
          </Button>
        </div>

        <table className="table table-xs">
          <thead>
            <tr>
              <th>#</th>
              <th>МЧЖ номи</th>
              <th>Директор Ф.И.Ш.</th>
              <th>телефони</th>
              <th>Банк номи</th>
              <th>Банк МФОси</th>
              <th>МЧЖ СТИР</th>
            </tr>
          </thead>
          <tbody>
            {ltd ? (
              ltd.map(({ id, ltd_name, direktor, bank, mfo, stir, tel }) => (
                <LtdList
                  key={id}
                  id={id}
                  ltd_name={ltd_name}
                  direktor={direktor}
                  bank={bank}
                  mfo={mfo}
                  stir={stir}
                  tel={tel}
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
      <AddNewLtd sendingData={sendingData} setSendingData={setSendingData} />
      <div className="flex w-full h-screen justify-center mt-5">
        <Button>
          <Link to="/">Орқага</Link>
        </Button>
      </div>
    </>
  );
}

export default Ltd;
