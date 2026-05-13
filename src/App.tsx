import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import Score from './pages/Score'
import Nav from './components/Nav'

import Test from './pages/Test'

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/score" element={<Score />} />
        <Route path="*" element={<div>404 - Page not found</div>} />

        {/* TEMPORARY TEST PAGE */}
        <Route path='test' element={<Test />} />
      </Routes>
    </>
  )
}

export default App
