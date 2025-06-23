import { useEffect, useState } from "react";
import { useAppStore } from "../lib/zustand";
import { getUsers, refreshToken } from "../request";
import UsersList from "../components/UsersList";
import { Button } from "../components/ui/button";

import { getFormData } from "../my-utils/index";
import AddNewItemModal from "../components/AddNewItemModal";
import { ClockLoader, PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";

function Users() {
  const [sendingData, setSendingData] = useState(null);
  const users = useAppStore((state) => state.users);
  const setUsers = useAppStore((state) => state.setUsers);
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const setAddItemModal = useAppStore((state) => state.setAddItemModal);

  useEffect(() => {
    getUsers(user?.access_token)
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        if (error.message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token });
              return getUsers(access_token);
            })
            .then((data) => setUsers(data))
            .catch((err) => console.error("Error after refresh:", err));
        }
      });
  }, [user, setUsers, setUser, sendingData]);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex justify-between mx-5 mb-8">
          <h1 className="text-3xl font-bold">Фойдаланувчилар рўйхати</h1>

          <Button
            onClick={setAddItemModal}
            disabled={users ? false : true}
            className={users ? "cursor-pointer" : "cursor-not-allowed"}
          >
            Фойдаланувчи қўшиш
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
                <th>Исми шарифи</th>
                <th>Хуқуқи</th>
                <th>Логин</th>
                <th>Фойдаланувчи тури</th>
                <th>Иш бошлаган сана</th>
                <th>Иш тугатилган сана</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users ? (
                users.map(
                  ({
                    id,
                    type,
                    username,
                    surname,
                    lastname,
                    startDate,
                    endDate,
                  }) => (
                    <UsersList
                      key={id}
                      id={id}
                      type={type}
                      username={username}
                      surname={surname}
                      lastname={lastname}
                      startDate={startDate}
                      endDate={endDate}
                    />
                  )
                )
              ) : (
                <tr>
                  <td colSpan="8">
                    {" "}
                    {/* Исправлено colSpan на 8 */}
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
      <AddNewItemModal
        sendingData={sendingData}
        setSendingData={setSendingData}
      />
      <div className="flex w-full h-screen justify-center ">
        <Button>
          <Link to="/">Орқага</Link>
        </Button>
      </div>
    </>
  );
}

export default Users;


