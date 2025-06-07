import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Box,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/chatProvider";
import UsersAdded from "../user/UsersAdded";
import UserListItem from "../user/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  // eslint-disable-next-line
  const { loading, setLoading } = useState(false);
  const [renameLoading, setRenameLoading] = useState();
  const toast = useToast();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "You are not an Admin!!",
        status: "error",
        isClosable: true,
        duration: 4000,
        position: "bottom",
      });
      return;
    }

    try {
      //   setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/kick",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      //   setLoading(false);
    } catch (error) {
      toast({
        title: "Problem in Removing this user!!",
        status: "error",
        description: error.response.data.message,
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "Participant Already in group",
        status: "error",
        isClosable: true,
        duration: 4000,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "You dont have the power to add members",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      //   setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/add",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      //   setLoading(false);
    } catch (error) {
      toast({
        title: "Problem in Adding this user!!",
        status: "error",
        description: error.response.data.message,
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error!!!!!",
        description: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      //   setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      //   setLoading(false);
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
      //   setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"work-sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {" "}
            {selectedChat.chatName}{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChat.users.map((u) => (
                <UsersAdded
                  key={user._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
                variant={"solid"}
                colorScheme="teal"
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Participants"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onCLick={() => handleRemove(user)} colorScheme="red">
              Leave !!
            </Button>
            <Button colorScheme="blue" ml={3} mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
