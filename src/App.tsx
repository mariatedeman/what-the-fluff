import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import Game from "./pages/Game"
import Score from "./pages/Score"

function App() {

  return (
    <>
      <h1 className='text-accent'>Header</h1>
      <p>This is a header</p>

      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/game">Game</Link>
          <Link to="/score">Score</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/score" element={<Score />} />
          <Route path="*" element={<div>404 - Page not found</div>} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
