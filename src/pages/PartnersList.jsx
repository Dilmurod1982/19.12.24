import { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import { getPartners, getUsers, refreshToken } from "../request";

import { Button } from "../components/ui/button";
import PartnersListt from "../components/PartnersListt";

import { getFormData } from "../my-utils/index";
import AddNewItemModal from "../components/AddNewItemModal";
import { ClockLoader, PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";
import AddNewPartner from "../components/AddNewPartner";

function PartnersList() {
  const [sendingData, setSendingData] = useState(null);
  const partners = useAppStore((state) => state.partners);
  const setPartners = useAppStore((state) => state.setPartners);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);

  useEffect(() => {
    getPartners(user?.access_token)
      .then((data) => {
        setPartners(data);
      })
      .catch((error) => {
        if (error.message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setPartners({ ...user, access_token });
              return getPartners(access_token);
            })
            .then((data) => setPartners(data))
            .catch((err) => console.error("Error after refresh:", err));
        }
      });
  }, [user, setPartners, setUser, sendingData]);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between mx-5 mb-8">
          <h1 className="text-3xl font-bold">Хамкор Ташкилотлар рўйхати</h1>

          <Button
            onClick={setAddItemModal}
            disabled={partners ? false : true}
            className={partners ? "cursor-pointer" : "cursor-not-allowed"}
          >
            Хамкор қўшиш
          </Button>
        </div>

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {" "}
          {/* Добавлено для ограничения высоты и прокрутки */}
          <table className="table table-xs">
            <thead className="sticky top-0 bg-white z-10">
              {" "}
              {/* Фиксированная шапка */}
              <tr>
                <th>#</th>
                <th>МЧЖ номи</th>
                <th>Директор</th>
                <th>Банк</th>
                <th>МФО</th>
                <th>ИНН</th>
                <th>Тел</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(partners) ? (
                partners.map(
                  ({ id, partner_name, direktor, bank, mfo, stir, tel }) => (
                    <PartnersListt
                      key={id}
                      id={id}
                      partner_name={partner_name}
                      direktor={direktor}
                      bank={bank}
                      mfo={mfo}
                      stir={stir}
                      tel={tel}
                    />
                  )
                )
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="flex w-full mt-10 mb-10 justify-end items-center">
                      <PulseLoader speedMultiplier={0.5} />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddNewPartner
        sendingData={sendingData}
        setSendingData={setSendingData}
      />
      <div className="flex w-full h-screen justify-center mt-3">
        <Button>
          <Link to="/partners">Орқага</Link>
        </Button>
      </div>
    </>
  );
}

export default PartnersList;
