import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Link,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import add from "@/public/icons/add.svg";

export const CommonModal = ({
  triggerButtonLabel = "Open Modal",
  triggerButtonProps = {},
  title = "Modal Title",
  content = null,
  footerButtons = [],
  placement = "top-center",
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        {...triggerButtonProps}
        className="bg-[#2f80ed] text-[#fff] text-[14px]"
      >
        <Image src={add} width={18} height={100} alt="Plus" />
        {triggerButtonLabel}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement={placement}
        classNames={{
          width: "100%",
          backdrop: "bg-[#000000]/60 backdrop-opacity-60 ",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent className="bg-[#23262f]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[#ffffff]">
                {title}
              </ModalHeader>
              <ModalBody className="text-[#fff]">{content}</ModalBody>
              <ModalFooter>
                {footerButtons.map(
                  ({ label, color, onClick, ...rest }, idx) => (
                    <Button
                      key={idx}
                      color={color || "primary"}
                      onPress={() => {
                        onClick && onClick(onClose);
                      }}
                      {...rest}
                    >
                      {label}
                    </Button>
                  )
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
