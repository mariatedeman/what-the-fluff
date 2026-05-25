import { NavLink } from "react-router-dom";

export default function Nav() {
  const playerName = sessionStorage.getItem("playerName");
  return (
    <nav className="flex gap-6 px-6 py-4 border-b border-border">
      <NavLink to="/">Home</NavLink>
      {playerName && <NavLink to="/game">Game</NavLink>}
      <NavLink to="/score">Score</NavLink>
    </nav>
  );
}
