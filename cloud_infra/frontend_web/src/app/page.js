"use client"

import Image from "next/image";
import DashboardGrid from "./components/DashboardGrid";
import FormCreateUser from "./components/FormCreateUser";
import UserSelection from "./components/UserSelection";
import image from "./logo/logo.webp";
import SensorDataComponent from "./components/SensorDataComponent";
import { useState, useEffect } from "react";
import { Modal } from "@nextui-org/react";


export default function Home() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);



  useEffect(() => {
    // Fetch users from the server
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/users"); // Replace with your API endpoint
        const data = await response.json();
        console.log(data);
        setUsers(data); // Assuming the response data is an array of users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);


  const handleUserSelection = (user) => {
    setSelectedUser(user);
    console.log(user); // Log the selected user ID or name here, for example: console.log(user.id);
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
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl ">
            {selectedUser ? `Hello, ${selectedUser.Name}` : 'Dashboard'}
          </h1>
        </div>
        <UserSelection onUserSelect={handleUserSelection} users={users} setShowForm={setShowForm}/>
      </div>
      <DashboardGrid selectedUser={selectedUser}/>
      <SensorDataComponent />
      {showForm && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-10">
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <FormCreateUser />
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
