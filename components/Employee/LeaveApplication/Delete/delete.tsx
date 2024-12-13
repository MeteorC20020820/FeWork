import axios from "axios";
import styles from "./delete.module.css";
import { Modal } from "antd";

export default function Delete(open: boolean, setOpen: Function, idLeave: any) {
  const token = localStorage?.getItem("authToken");
  const apiDeleteDepartment = async () => {
    try {
      
      
    } catch (error) {
      console.log(error);
    }
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
        <p className={styles.title}>Delete LeaveApplication</p>
        <p className={styles.text}>
          Are you sure you want to delete leaveapplication?
        </p>
        <div className={styles.bodyBtn}>
          <button
            className={styles.btnLogout}
            onClick={() => apiDeleteDepartment()}
          >
            Delete
          </button>
          <button className={styles.btnCancel} onClick={() => setOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
