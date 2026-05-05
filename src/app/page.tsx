import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

type User = {
  id: string
  name: string
}

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: users, error } = await supabase.from('users').select()

  // Debug: skriv ut vad vi får
  console.log('Users data:', users)
  console.log('Error:', error)

  if (error) {
    return <div>Fel: {error.message}</div>
  }

  if (!users || users.length === 0) {
    return <div>Ingen data hittad. Checka Row Level Security (RLS) inställningarna!</div>
  }

  return (
    <>
    <h2>Test</h2>

    <ul>
      {users?.map((user: User) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>

      </>
  )
}
