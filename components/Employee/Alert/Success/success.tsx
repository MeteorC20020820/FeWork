// components/AlertModal.js
import React, { useEffect } from "react";
import styles from "./success.module.css";
import { SuccessA } from "@/components/icon/icon";

interface SuccessProps {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  message: string;
}

export default function Success(isOpen:boolean, onClose:Function, message:string) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose(false); // Đóng modal sau 3 giây
      }, 3000);

      return () => clearTimeout(timer); // Xóa timer khi component bị unmount
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modaloverlay}>
      <div className={styles.modalcontent}>
        <div
          style={{
            marginLeft: "-20px",
            zIndex: "9999",
            backgroundColor: "white",
            borderRadius: "50%",
          }}
        >
          <SuccessA color="green" width={50} height={50} />
        </div>
        <p className={styles.modalmessage}>{message}</p>
      </div>
    </div>
  );
};
