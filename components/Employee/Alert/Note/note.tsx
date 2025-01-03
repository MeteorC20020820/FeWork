// components/AlertModal.js
import React, { useEffect } from "react";
import styles from "./note.module.css";
import { NoteA } from "@/components/icon/icon";

interface SuccessProps {
  note: boolean;
  setNote: Function;
  message: string;
}

export default function Note({ note, setNote, message }: SuccessProps) {
  useEffect(() => {
    if (note) {
      const timer = setTimeout(() => {
        setNote(false); // Đóng modal sau 3 giây
      }, 8000);

      return () => clearTimeout(timer); // Xóa timer khi component bị unmount
    }
  }, [note, setNote]);

  if (!note) return null;

  return (
    <div className={styles.modaloverlay}>
      <div className={styles.modalcontent}>
        <div
          style={{
            marginLeft: "-40px",
            zIndex: "9999",
            
          }}
        >
          <NoteA color="#8b4500" width={50} height={50} />
        </div>
        <p className={styles.modalmessage}>{message}</p>
      </div>
    </div>
  );
}
