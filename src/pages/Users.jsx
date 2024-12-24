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
      .then(({ data }) => setUsers(data))
      .catch(({ message }) => {
        if (message === "403") {
          refreshToken(user?.refreshToken)
            .then(({ access_token }) => {
              setUser({ ...user, access_token }); // Обновляем токен
              return getUsers(access_token); // Повторный запрос
            })
            .then(({ data }) => setUsers(data))
            .catch((error) => console.error("Error fetching users:", error));
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

        <table className="table table-xs">
          <thead>
            <tr>
              <th>#</th>
              <th>Исми шарифи</th>
              <th>Хуқуқи</th>
            </tr>
          </thead>
          <tbody>
            {users ? (
              users.map(({ id, type, username }) => (
                <UsersList key={id} id={id} type={type} username={username} />
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
