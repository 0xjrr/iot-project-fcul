import Image from "next/image";
import DashboardGrid from "./components/DashboardGrid";
import FormCreateUser from "./components/FormCreateUser";
import UserSelection from "./components/UserSelection";
import image from "./logo/logo.webp";
import SensorDataComponent from "./components/SensorDataComponent";

export default function Home() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelection = (user) => {
    setSelectedUser(user);
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 min-w-full">
      <div className="flex justify-between w-full md:w-4/5 mx-auto">
        <div className="flex items-center">
          {" "}
          <Image
            src={image}
            alt="Image Description"
            height={100}
          />
          {" "}
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl ">Dashboard</h1>
        </div>
        <UserSelection onUserSelect={handleUserSelection}/>
      </div>
      <DashboardGrid />
      <FormCreateUser />
      <SensorDataComponent />
    </main>
  );
}
