"use client"

import React, { useEffect, useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

export default function UserSelection() {
  const [users, setUsers] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  useEffect(() => {
    // Fetch users from the server
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/users'); // Replace with your API endpoint
        const data = await response.json();
        console.log(data);
        setUsers(data); // Assuming the response data is an array of users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUserClick = () => {
    // Open a new window with a form for creating a user
    window.open('/path-to-create-user-form', '_blank'); 
  };

  const selectedValue = selectedKeys.size > 0
    ? Array.from(selectedKeys).map(key => users.find(user => user.id === key)?.name).join(", ")
    : "Select User";

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
        className="
        bg-blue-500 
        text-white 
        max-h-12 
        py-1 
        px-6 
        rounded-md 
        hover:bg-blue-700" 
        variant="bordered"
        >
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User selection"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        {users.map(user => (
          <DropdownItem key={user.id}>{user.name}</DropdownItem> // Assuming each user has `id` and `name`
        ))}
        <DropdownItem key="create_user" onSelect={handleCreateUserClick}>+ Create User</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
