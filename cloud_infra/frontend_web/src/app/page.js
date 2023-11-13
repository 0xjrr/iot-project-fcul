import Image from 'next/image'
import DashboardGrid from './components/DashboardGrid'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 min-w-full">
      <h1 className=''>
        Dashboard Template:
      </h1>
      <DashboardGrid />
    </main>
  )
}
