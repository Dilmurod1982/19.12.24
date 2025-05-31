import React from "react";
import { Link } from "react-router-dom";

export default function Partners() {
  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <div>
        <p>Ташкилотлар бўйича ҳисоботлар</p>
      </div>
      <div>
        <ul>
          <li>
            <Link to="/partnerslist" className="btn btn-neutral">
              Ташкилотлар рўйхати
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
