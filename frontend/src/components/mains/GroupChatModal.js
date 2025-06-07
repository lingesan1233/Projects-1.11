import React, { useState } from "react";
import axios from "axios";
import { FormControl, Input } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../context/chatProvider";
import UserListItem from "../user/UserListItem";
import UsersAdded from "../user/UsersAdded";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Error dirty Error!!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
        description: error.message,
      });
    }
  };

  const handleGroup = (addedUser) => {
    if (selectedUser.includes(addedUser)) {
      toast({
        title: "User already added",
        status: "warning",
        description: "try and select users not already present in the group",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setSelectedUser([...selectedUser, addedUser]);
  };

  const handleDlt = (delUser) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUser) {
      toast({
        title: "Insufficient information",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Chat Succesfully Created",
        status: "success",
        description: "Go chat with your friends",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed!!",
        status: "error",
        description: error.message,
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}> {children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily={"work-sans"}
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            New Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir="column" alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Participants"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display={"flex"} flexWrap={"wrap"}>
              {selectedUser.map((u) => (
                <UsersAdded
                  key={user._id}
                  user={u}
                  handleFunction={() => handleDlt(u)}
                />
              ))}
            </Box>

            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
