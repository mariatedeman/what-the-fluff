import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import type { User } from "../types/User";

export default function GetUsers() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch data from database and throw error if failed
  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error
        if (mounted) setUsers(data)
      } catch (err) {
        if (mounted) setFetchError(err instanceof Error ? err.message : String(err))
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
            <div>

      {/* Display data from database */}
      {loading && <p>Loading...</p>}
      {fetchError && <p>Error: {String(fetchError)}</p>}
      {users && users.length > 0 ? (
        <p>Från users-tabellen: {users[0].name}</p>
      ) : null}

      </div>

      )
}