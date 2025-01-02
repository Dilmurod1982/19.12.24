import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

function Docs() {
  return (
    <div className="flex flex-col justify-center items-center gap-5 w-full">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">Хужжатлар рўхати</h1>
      </div>
      <ul className="flex flex-col justify-center items-center gap-3 w-[600px]">
        <li className="flex justify-center w-full">
          <Button className="flex justify-center w-full">
            <Link className="text-xl" to="/licenses">
              Лицензиялар
            </Link>
          </Button>
        </li>
      </ul>
    </div>
  );
}

export default Docs;
