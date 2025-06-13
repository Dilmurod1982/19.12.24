import { Link } from "react-router-dom";
import { useAppStore } from "../lib/zustand";

import { useTokenValidation } from "../hooks/useTokenValidation";

function UserHome() {
  const user = useAppStore((state) => state.user);

  useTokenValidation();

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-center text-2xl font-bold">Фойдаланувчи сахифаси</h1>
      <div className="flex justify-center">
        <ul className="flex flex-col gap-2 w-96">
          <li>
            <Link
              className="btn btn-neutral text-xl w-full text-white"
              to="/userstations"
            >
              Муддатли хужжатлар
            </Link>
          </li>
          <li>
            <Link
              className="btn btn-neutral text-xl w-full text-white"
              to="/userindefinite"
            >
              Муддатсиз хужжатлар
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserHome;
