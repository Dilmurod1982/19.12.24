import React from "react";
import { Link } from "react-router-dom";

export default function Payment() {
  return (
    <div className="flex justify-center items-center">
      <ul className="flex flex-col gap-5">
        <li>
          <Link
            to="/paymentreport"
            className="btn btn-outline  text-2xl font-bold w-full"
          >
            Тўловлар рўйхати
          </Link>
        </li>
        <li>
          <Link
            to="/confirmpayment"
            className="btn btn-outline  text-2xl font-bold w-full"
          >
            Тасдиқланишни кутаётган тўловлар
          </Link>
        </li>
      </ul>
    </div>
  );
}
