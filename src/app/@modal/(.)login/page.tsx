"use client";

import { title } from "@/app/(auth)/login/constants";
import { Form } from "@/app/(auth)/login/form";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const { isOpen, onClose } = useDisclosure({ isOpen: true });

  return (
    <Modal
      size="md"
      isOpen={isOpen}
      onClose={() => {
        onClose();
        router.back();
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>

        <ModalBody>
          <Form
            onSubmit={() => {
              onClose();
              router.back();

              setTimeout(() => {
                router.refresh();
              }, 250);
            }}
          />
          <div className="pb-1"></div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
