//login/signup page
import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/signup";

const HomePage = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex" //display
        justifyContent="center"
        alignContent="center"
        p={3} //padding
        bg="white" //background
        w="100%" //width
        m="40px 0 15px 0" //margin
        borderRadius="lg"
        borderWidth="2px"
      >
        <Text
          textAlign={"center"}
          color={"black"}
          fontFamily="Work sans"
          fontSize="4xl"
        >
          Chit-Chat
        </Text>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        color={"black"}
        borderRadius={"lg"}
        borderWidth={"2px"}
      >
        <Tabs variant="unstyled">
          <TabList>
            <Tab _selected={{ color: "white", bg: "black" }} width={"25%"}>
              Login
            </Tab>
            <Tab _selected={{ color: "white", bg: "black" }} width={"25%"}>
              Sign-Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {" "}
              <Login />{" "}
            </TabPanel>
            <TabPanel>
              {" "}
              <Signup />{" "}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
