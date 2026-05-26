import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Score from "./pages/Score";
import { Layout } from "./components/layout/Layout";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();

  return (
    <Layout>
      {location.pathname === "/score" && (
        <img
          src="/logo.svg"
          alt="what the fluff logo"
          className="mx-auto h-auto w-40 my-6"
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/score" element={<Score />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
