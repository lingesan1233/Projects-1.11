import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/chatProvider";
import { useToast, Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/logic";
import GroupChatModal from "./GroupChatModal";
import axios from "axios";
import ChatLoading from "./ChatLoading";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Could'nt fetch the chat!!",
        status: "error",
        description: error.message,
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    console.log(chats);
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "30%" }}
      borderRadius="lg"
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontFamily={"Work-sans"}
        fontSize={{ base: "28px", md: "30px" }}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                color={selectedChat === chat ? "whitesmoke" : "black"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                px={3}
                py={3}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
