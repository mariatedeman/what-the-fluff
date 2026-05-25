import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Score from "./pages/Score";
// import Nav from "./components/Nav";

//IMPORTS FOR TEST PAGES
import TestIndex from "./pages/test/index";
import TestScore from "./pages/test/Score";
import TestTivoli from "./pages/test/Tivoli";
import AppFlow from "./pages/test/AppFlow";
import { Layout } from "./components/layout/Layout";

function App() {
  const location = useLocation();

  return (
    <Layout>
      {/* <Nav /> */}
      {location.pathname === "/score" && 
        <img src="/logo.svg" 
          alt="what the fluff logo" 
          className="mx-auto h-auto w-40 my-6" />
      }

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/score" element={<Score />} />
        <Route path="*" element={<div>404 - Page not found</div>} />

        {/* TEMPORARY TEST PAGES — ONLY MOUNTED IN DEV (npm run dev), STRIPPED FROM PRODUCTION BUILD */}
        {import.meta.env.DEV && (
          <Route path="test">
            <Route index element={<TestIndex />} />
            <Route path="score" element={<TestScore />} />
            <Route path="tivoli" element={<TestTivoli />} />
            <Route path="appflow" element={<AppFlow />} />
          </Route>
        )}
      </Routes>
      </Layout>
  );
}

export default App;
