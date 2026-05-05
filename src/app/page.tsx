import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Button from './components/Button'
import InstructionsModal from './components/InstructionsModal'

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
    <section className='h-svh flex flex-col justify-center items-center gap-2'>

      <h2 className='text-4xl'>Välkommen</h2>

      <ul>
        {users?.map((user: User) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      <Button href="/game" className="uppercase">Go to Game Page</Button>
      <Button variant='secondary' className="uppercase">Start Game secondary</Button>

      <InstructionsModal/>
      

    </section>
  )
}
