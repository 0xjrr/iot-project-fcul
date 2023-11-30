import Image from 'next/image'
import DashboardGrid from './components/DashboardGrid'
import FormCreateUser from './components/FormCreateUser'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 min-w-full">
      <h1 className=''>
        Dashboard Template:
      </h1>
      <DashboardGrid />
      <FormCreateUser />
    </main>
  )
}
