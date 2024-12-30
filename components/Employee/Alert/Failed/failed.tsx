// components/AlertModal.js
import React, { useEffect } from "react";
import styles from "./failed.module.css";
import { SuccessA } from "@/components/icon/icon";

interface SuccessProps {
  failed: boolean;
  setFailed: Function;
  message: string;
}

export default function Failed({
  failed,
  setFailed,
  message,
}: SuccessProps) {
  useEffect(() => {
    if (failed) {
      const timer = setTimeout(() => {
        setFailed(false); // Đóng modal sau 3 giây
      }, 4000);

      return () => clearTimeout(timer); // Xóa timer khi component bị unmount
    }
  }, [failed, setFailed]);

  if (!failed) return null;

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
}
