'use client'
import { useRouter } from "next/navigation";
import styles from "./logout.module.css";
import { Modal } from "antd";
import { useState } from "react";

export default function LogOut(open: boolean, setOpen: Function) {
  const router = useRouter()
  const [loading, setLoading] = useState(false); 
  const handleNavigation = (path: string) => {
    setLoading(true); 
    router.push(path);
    setTimeout(() => setLoading(false), 1000); 
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    handleNavigation("/")
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      width={600}
      closable={false}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
    >
      <div className={styles.bodyLogout}>
        <p className={styles.title}>LOGOUT</p>
        <p className={styles.text}>
          Are you sure you want to log out of the system?
        </p>
        <div className={styles.bodyBtn}>
          <button className={styles.btnLogout} onClick={() => handleLogout()}>Logout</button>
          <button className={styles.btnCancel} onClick={() => setOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </Modal>
  );
}
