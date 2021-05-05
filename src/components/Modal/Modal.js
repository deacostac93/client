import React from "react";
import { Modal as ModalAntd } from "antd";

export default function Modal({ children, title, isVisible, setIsVisible }) {
  const handleOk = () => {
    setIsVisible(false);
  };
  return (
    <ModalAntd
      title={title}
      centered
      visible={isVisible}
      onOk={handleOk}
      footer={false}
    >
      {children}
    </ModalAntd>
  );
}
