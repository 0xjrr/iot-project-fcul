import Image from 'next/image'
import Grid from './components/Grid'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 min-w-full">
      <h1 className=''>
        Dashboard Template:
      </h1>
      <Grid />
    </main>
  )
}
