"use client"

import React, { useState } from 'react';
import axios from 'axios';

const FormCreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [device, setDevice] = useState('');

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
      const response = await axios.post('http://localhost:8080/user', userData);
      console.log('User created:', response.data);
      // Handle the response here, maybe clear the form or show a success message
    } catch (error) {
      console.error('Error creating user:', error);
      console.log(userData);
      // Handle error here, show error message to user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Age:</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>
      <div>
        <label>Gender:</label>
        <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
      </div>
      <div>
        <label>Device:</label>
        <input type="text" value={device} onChange={(e) => setDevice(e.target.value)} />
      </div>
      <button type="submit">Create User</button>
    </form>
  );
};

export default FormCreateUser;