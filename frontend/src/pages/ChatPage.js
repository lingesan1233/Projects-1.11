import { ChatState } from "../context/chatProvider";
import { Box } from "@chakra-ui/react";
import ChatBox from "../components/mains/ChatBox";
import SideDrawer from "../components/mains/SideDrawer";
import MyChats from "../components/mains/MyChats";
import { useState } from "react";

const ChatPage = () => {
  const user = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        p={"10px"}
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
