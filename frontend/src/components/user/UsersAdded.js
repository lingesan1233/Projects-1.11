import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UsersAdded = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      fontFamily={"work-sans"}
      fontSize={12}
      onClick={handleFunction}
      bgColor={"green"}
      color={"white"}
      display={"flex"}
      flexDir={"row"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      {user.name}
      <CloseIcon ml={2} w={2} h={3} />
    </Box>
  );
};

export default UsersAdded;
