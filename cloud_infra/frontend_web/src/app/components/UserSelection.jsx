"use client";

import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";

export default function UserSelection({ onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

  const handleCreateUserClick = () => {
    // Open a new window with a form for creating a user
    console.log("Opening a new window with a form for creating a user");
  };

  const handleUserSelection = (user) => {
    onUserSelect(user);
  }
  
  const selectedValue =
    selectedKeys.size > 0
      ? Array.from(selectedKeys)
          .map((key) => users.find((user) => user.id === key)?.name)
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
        hover:bg-blue-700"
            variant="bordered"
          >
            {selectedValue}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User selection"
          className="          rounded-md 
        "
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          {users.map((user) => (
            <DropdownItem
              className="
          bg-gray-500 
          text-white 
          max-h-12 
          py-1 
          px-6 
          hover:bg-gray-700"
              variant="bordered"
              key={user.ID}
              textValue={user.Name}
            >
              {user.Name}
            </DropdownItem> // Assuming each user has `id` and `name`
          ))}
          <DropdownItem
            className="
        bg-blue-500 
        text-white 
        max-h-12 
        py-1 
        px-6  
        hover:bg-blue-700"
            variant="bordered"
            key="create_user"
            onClick={onOpen}
          >
            + Create User
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                />
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                />
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Remember me
                  </Checkbox>
                  <Link color="primary" href="#" size="sm">
                    Forgot password?
                  </Link>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Sign in
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      ;
    </>
  );
}
