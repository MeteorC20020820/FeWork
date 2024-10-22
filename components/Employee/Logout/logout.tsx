import styles from "./logout.module.css";
import { Modal } from "antd";

export default function LogOut(open: boolean, setOpen: Function) {
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
        <p className={styles.text}>Are you sure you want to log out of the system?</p>
        <div className={styles.bodyBtn}>
            <button className={styles.btnLogout}>Logout</button>
            <button className={styles.btnCancel} onClick={()=> setOpen(false)}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}
