//imports
import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/layout";
import { Tooltip, Avatar } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
//import { NotificationBadge, Effect } from "react-notification-badge";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../../context/chatProvider";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../user/UserListItem";
import { getSender } from "../../config/logic";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line
  const [loadingChat, setLoadingChat] = useState();
  const history = useHistory();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  //functions
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Empty Search Bar",
        description: "Unfortunately we don't have non existing users.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
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
      console.log(user.token);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Could'nt fetch user",
        description: `${error.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Could'nt fetch the chat",
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
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignContent={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search for Users">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={"4"} fontSize={"large"}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"xx-large"} fontFamily={"sans-sarif"}>
          Chit-Chat
        </Text>

        {/* Notifications icon */}
        <Menu>
          <MenuButton as={Button} p={"l"} mt={1}>
            {/* <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            /> */}

            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "No New Messages"}
            {notification.map((msg) => (
              <MenuItem
                key={msg._id}
                onClick={() => {
                  setSelectedChat(msg.chat);
                  setNotification(notification.filter((n) => n !== msg));
                }}
              >
                {msg.chat.isGroupChat
                  ? `unread message(s) in ${msg.chat.chatNme}`
                  : `${getSender(user, msg.chat.users)} texted you.`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            mt={1}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            fontSize={"xl"}
          >
            {/* name is not defined here [maybe user too] */}
            {user && (
              <>
                <Avatar
                  size="sm"
                  cursor={"pointer"}
                  name={user.name}
                  src={user.pic}
                />
              </>
            )}
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>

            <MenuItem onClick={logoutHandler}>LogOut</MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Drawer placement="left"  isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search new users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type here..."
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
          </DrawerBody>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
