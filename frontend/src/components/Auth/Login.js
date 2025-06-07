import React, { useState } from "react";
import {
  VStack,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Login = () => {
  // const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show1, setShow1] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  function handleClick1() {
    setShow1(!show1);
  }

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "I see Empty Fields!!",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack>
      <FormControl>
        <FormLabel>Email:</FormLabel>
        <Input
          type="email"
          placeholder="Enter your Email address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormLabel>Password:</FormLabel>
        <InputGroup>
          <Input
            type={show1 ? "text" : "password"}
            placeholder="Set your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick1}>
              {show1 ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Button
          bg="black"
          color={"white"}
          outlineColor={"black"}
          isLoading={loading}
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
        >
          Login
        </Button>
      </FormControl>
    </VStack>
  );
};

export default Login;
