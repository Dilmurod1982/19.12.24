import React from "react";
import { Link } from "react-router-dom";

export default function Reports() {
  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <div>
        <p className="text-2xl font-bold">ҲИСОБОТЛАР</p>
      </div>
      <ul>
        <li>
          <Link className="btn btn-neutral text-[15px]" to="/partners">
            Ташкилотлар бўйича
          </Link>
        </li>
      </ul>
    </div>
  );
}
