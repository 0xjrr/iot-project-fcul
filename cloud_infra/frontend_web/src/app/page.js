import Image from "next/image";
import DashboardGrid from "./components/DashboardGrid";
import FormCreateUser from "./components/FormCreateUser";
import UserSelection from "./components/UserSelection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 min-w-full">
      <div className="flex justify-between w-4/5 mx-auto">
        <h1>Dashboard</h1>
        <UserSelection /> {/* This is your new component */}
      </div>
      <DashboardGrid />
      <FormCreateUser />
    </main>
  );
}
