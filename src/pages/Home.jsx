import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAppStore } from "../lib/zustand";

export default function AdminHome() {
  const user = useAppStore((state) => state.user);
  return (
    <div className="flex flex-col  items-center w-full h-screen mt-10">
      <div className="flex flex-col gap-5 w-96">
        {user.type === "admin" && (
          <>
            <Button className="w-full">
              <Link className="text-2xl" to="/ltd">
                МЧЖлар
              </Link>
            </Button>
          </>
        )}
        <Button className="w-full">
          <Link className="text-2xl" to="/stations">
            Шахобчалар
          </Link>
        </Button>
        <Button className="w-full">
          <Link className="text-2xl" to="/docs">
            Хужжатлар
          </Link>
        </Button>
      </div>
    </div>
  );
}
