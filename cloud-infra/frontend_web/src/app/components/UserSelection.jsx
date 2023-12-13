import React, { useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

export default function UserSelection({ users, onUserSelect, setShowForm }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  

  const handleSelectionChange = (key) => {
    if (key === "create_user") {
      setShowForm(true);
    } else {
      setSelectedKeys(new Set([key]));
      const user = users.find((u) => u.ID === key);
      if (user) {
        onUserSelect(user);
      }
    }
  };

  const selectedValue =
    selectedKeys.size > 0
      ? Array.from(selectedKeys)
          .map((key) => users.find((user) => user.ID === key)?.Name)
          .join(", ")
      : "Select User";

  return (
    <>
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
          hover:bg-blue-700">
            {selectedValue}
            </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User selection"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
        >
          {users.map((user) => (
            <DropdownItem 
              className="bg-gray-500 text-white max-h-12 py-1 px-6 hover:bg-gray-700"
              key={user.ID} 
              onClick={() => handleSelectionChange(user.ID)}
            >
              {user.Name}
            </DropdownItem>
          ))}
          <DropdownItem 
            className="bg-blue-500 text-white max-h-12 py-1 px-6 hover:bg-blue-700"
            key="create_user"
            onClick={() => handleSelectionChange("create_user")}
          >
            + Create User
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
