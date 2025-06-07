import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../../config/logic";
import { ChatState } from "../../context/chatProvider";
import { Tooltip, Avatar } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} hasArrow placement="bottom">
                <Avatar
                  mt={"7px"}
                  mr={1}
                  size={"sm"}
                  name={m.sender.name}
                  src={m.sender.pic}
                  cursor={"pointer"}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#7fff7f" : "#add8e6"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginBottom: "3px",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i) ? 2 : 6,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
