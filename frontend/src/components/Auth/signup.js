import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show1, setShow1] = useState();
  const [pic, setPic] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [show2, setShow2] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  function handleClick1() {
    setShow1(!show1);
  }

  function handleClick2() {
    setShow2(!show2);
  }

  function postDetails(pics) {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Select a valid file type",
        description: "only .jpeg or .png files accepted",
        position: "top",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "webchat");
      data.append("cloud_name", "dypcbwxam");
      fetch("https://api.cloudinary.com/v1_1/dypcbwxam/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.url.toString());
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "please select a valid image",
        position: "top",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  }

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Kindly fill all the necessary fields",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Check for Password mismatch!!",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Registered",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
        description:
          "Congratulations you've successfully registered to Chit-Chat!!",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        status: "error",
        isClosable: true,
        position: "top",
        duration: 9000,
        title: "Something went Wrong!!",
        description: error.response.data.message,
      });
      setLoading(false);
    }
  };

  return (
    <VStack margin={"8px"}>
      <FormControl>
        <FormLabel>Name:</FormLabel>
        <Input
          type="text"
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
        />

        <FormLabel>Email:</FormLabel>
        <Input
          type="email"
          placeholder="Enter your Email address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormLabel>Profile Picture:</FormLabel>
        <Input
          type="file"
          p={1.8}
          placeholder="Set your Profile picture"
          accept="image/*"
          onChange={(e) => {
            return postDetails(e.target.files[0]);
          }}
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

        <FormLabel>Confirm Password:</FormLabel>
        <InputGroup>
          <Input
            type={show2 ? "text" : "password"}
            placeholder="Enter your Password again"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick2}>
              {show2 ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Button
          bg="black"
          color={"white"}
          outlineColor={"black"}
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </FormControl>
    </VStack>
  );
};

export default Signup;
