// components/AlertModal.js
import React, { useEffect } from "react";
import styles from "./success.module.css";
import { SuccessA } from "@/components/icon/icon";

interface SuccessProps {
  success: boolean;
  setSuccess: Function,
  message: string;
}

export default function Success ({ success, setSuccess, message}:SuccessProps) {
  console.log(success)
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false); // Đóng modal sau 3 giây
      }, 3000);

      return () => clearTimeout(timer); // Xóa timer khi component bị unmount
    }
  }, [success, setSuccess]);

  if (!success) return null;

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

