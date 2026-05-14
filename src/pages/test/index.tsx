import { Link } from "react-router-dom";

export default function TestIndex() {
  return (
    <div className="p-5">
      <h1>TestIndex</h1>
      <ul className="flex gap-4 justify-center">
        <li className="bg-white rounded-xl p-2">
          <Link to="score">Score submission flow</Link>
        </li>
        <li className="bg-white rounded-xl p-2">
          <Link to="tivoli">Tivoli token flow</Link>
        </li>
      </ul>
    </div>
  );
}
