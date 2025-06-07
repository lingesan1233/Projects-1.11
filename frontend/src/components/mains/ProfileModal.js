import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";

import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily={"work-sans"}
            fontSize={"xx-large"}
            display={"flex"}
            justifyContent={"center"}
          >
            {user && user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            alignContent={"center"}
            alignItems={"center"}
          >
            {user && (
              <>
                <Image
                  src={user.pic}
                  alt={user.name}
                  boxShadow={"-moz-initial"}
                  boxSize="100px"
                  borderRadius={"full"}
                />
              </>
            )}

            {user && (
              <>
                <Text
                  fontFamily={"work-sans"}
                  padding={"20px"}
                  fontSize={"xl"}
                  textAlign={"center"}
                >
                  {" "}
                  📧:
                  {user.email}
                </Text>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
