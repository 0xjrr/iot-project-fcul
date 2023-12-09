"use client";

import React, { useState } from "react";
import axios from "axios";

const FormCreateUser = ({ onFormSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [device, setDevice] = useState("");
  const [height, setHeight] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      Name: name,
      Email: email,
      Age: parseInt(age),
      Weight: parseInt(weight),
      Height: parseFloat(height),
      Gender: gender,
      Device: device,
    };

    try {
      const response = await axios.post("http://localhost:8080/user", userData);
      console.log("User created:", response.data);
      // Clear the form
      onFormSubmit()
    } catch (error) {
      console.error("Error creating user:", error);
      console.log(userData);
      // Show error message to user
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
          required
        />
      </div>
      <div className="flex justify-between items-center">
        <label className="w-1/3">Email:</label>
        <input
          className="bg-transparent text-white rounded-md border-white border-2 w-2/3"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          title="Please enter a valid email address."
          required
        />
      </div>
      <div className="flex justify-between items-center">
        <label className="w-1/3">Weight:</label>
        <input
          className="bg-transparent text-white rounded-md border-white border-2 w-2/3"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          min={20} // Set minimum value
          required
        />
      </div>
      <div className="flex justify-between items-center">
        <label className="w-1/3">Height:</label>
        <input
          className="bg-transparent text-white rounded-md border-white border-2 w-2/3"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          min={0.5} // Set minimum value to 0.50 meters
          max={2.5} // Set maximum value to 2.50 meters
          step={0.01} // Allow increments of 0.01 for precision
          required
        />
      </div>
      <div className="flex justify-between items-center">
        <label className="w-1/3">Age:</label>
        <input
          className="bg-transparent text-white rounded-md border-white border-2 w-2/3"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min={20} // Set minimum value
          max={89} // Set maximum value
          required
        />
      </div>
      <div className="flex justify-between items-center">
        <label className="w-1/3">Gender:</label>
        <select
          className="bg-transparent text-white rounded-md border-white border-2 w-2/3"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option
            className="bg-gray-800 text-white rounded-md border-white border-2 w-2/3"
            value=""
            disabled
            selected
          >
            Select Gender
          </option>{" "}
          {/* Placeholder option */}
          <option
            className="bg-gray-800 text-white rounded-md border-white border-2 w-2/3"
            value="Female"
          >
            Female
          </option>
          <option
            className="bg-gray-800 text-white rounded-md border-white border-2 w-2/3"
            value="Male"
          >
            Male
          </option>
        </select>
      </div>
      <div className="flex justify-between items-center">
        <label className="w-1/3">Device:</label>
        <input
          className="bg-transparent text-white rounded-md border-white border-2 w-2/3"
          type="text"
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Create User
      </button>
    </form>
  );
};

export default FormCreateUser;
