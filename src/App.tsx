import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { useEffect, useState } from "react";

// Pages
import Home from "./pages/Home"
import Game from "./pages/Game"
import Score from "./pages/Score"

// Data
import supabase from "./lib/supabase";
import type { User } from "./models/User";

function App() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string>(null);

  // Fetch data from database and throw error if failed
  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error
        if (mounted) setUsers(data)
      } catch (err) {
        if (mounted) setFetchError(err) 
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchUsers()

    return () => { 
      mounted = false 
    }
  }, [])

  return (
    <>
      <h1 className='text-accent'>Header</h1>
      <p>This is a header</p>

      {/* Display data from database */}
      {loading && <p>Loading...</p>}
      {fetchError && <p>Error: {String(fetchError)}</p>}
      {users && users.length > 0 ? (
        <p>{users[0].name}</p>
      ) : null}


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
