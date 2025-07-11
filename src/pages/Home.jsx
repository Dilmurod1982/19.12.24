import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAppStore } from "../lib/zustand";
import { fetchDataWithTokenRefresh, getDocs } from "../request";
import { toast } from "sonner";
import { useEffect } from "react";

export default function Home() {
  const user = useAppStore((state) => state.user);

  const setStations = useAppStore((state) => state.setStations);

  const setUser = useAppStore((state) => state.setUser);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDataWithTokenRefresh(
      () => getDocs(user?.access_token, "stations"),
      setStations,
      user,
      setUser,
      navigate,
      toast
    );
  }, [user, setStations]);

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
        {(user.type === "admin" || user.type === "nazorat") && (
          <Button className="w-full">
            <Link className="text-2xl" to="/stations">
              Шахобчалар
            </Link>
          </Button>
        )}
        <Button className="w-full">
          <Link className="text-2xl" to="/docs">
            Муддатли хужжатлар
          </Link>
        </Button>
        <Button className="w-full">
          <Link className="text-2xl" to="/indefinite">
            Муддатсиз хужжатлар
          </Link>
        </Button>
        {(user.type === "admin" || user.type === "nazoratBooker") && (
          <Button className="w-full">
            <Link className="text-2xl" to="/dailyreports">
              Кунлик ҳисоботлар
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
