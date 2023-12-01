"use client";

import React, { useState } from "react";
import axios from "axios";

const FormCreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [device, setDevice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      Name: name,
      Email: email,
      Age: parseInt(age),
      Gender: gender,
      Device: device,
    };

    try {
      const response = await axios.post("http://localhost:8080/user", userData);
      console.log("User created:", response.data);
      // Handle the response here, maybe clear the form or show a success message
    } catch (error) {
      console.error("Error creating user:", error);
      console.log(userData);
      // Handle error here, show error message to user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {" "}
      {/* Add spacing between each form group */}
      <div className="flex justify-between items-center">
        <label className="w-1/3">Name:</label> {/* Adjust width as needed */}
        <input
          className="bg-transparent text-white rounded-md border-white border-2 w-2/3"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <label className="w-1/3">Email:</label>
        <input
          className="bg-transparent text-white rounded-md border-white border-2 w-2/3"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <label className="w-1/3">Age:</label>
        <input
          className="bg-transparent text-white rounded-md border-white border-2 w-2/3"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <label className="w-1/3">Gender:</label>
        <input
          className="bg-transparent text-white rounded-md border-white border-2 w-2/3"
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <label className="w-1/3">Device:</label>
        <input
          className="bg-transparent text-white rounded-md border-white border-2 w-2/3"
          type="text"
          value={device}
          onChange={(e) => setDevice(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">
        Create User
      </button>
    </form>
  );
};

export default FormCreateUser;
