import axios from "axios";
import styles from "./delete.module.css";
import { Modal,Button } from "antd";

export default function Delete(open: boolean, setOpen: Function, idLeave: any, setSuccess:Function, setMessage:Function, reset:Function) {
  const token = localStorage?.getItem("authToken");
  const apiDeleteDepartment = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:7295/api/LeaveReq/${idLeave}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status == 200) {
        setSuccess(true)
        setMessage("Delete leave request successfully!");
        setOpen(false)
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      title="Delete Employee"
      open={open}
      onCancel={()=>setOpen(false)}
      footer={[
        <Button key="cancel" onClick={()=>setOpen(false)}>
          Cancel
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          onClick={() => apiDeleteDepartment()}
        >
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete leaveapplication?</p>
    </Modal>
    // <Modal
    //   open={open}
    //   onCancel={() => setOpen(false)}
    //   width={600}
    //   closable={false}
    //   cancelButtonProps={{ style: { display: "none" } }}
    //   okButtonProps={{ style: { display: "none" } }}
    // >
    //   <div className={styles.bodyLogout}>
    //     <p className={styles.title}>Delete LeaveApplication</p>
    //     <p className={styles.text}>
    //       Are you sure you want to delete leaveapplication?
    //     </p>
    //     <div className={styles.bodyBtn}>
    //       <button
    //         className={styles.btnLogout}
    //         onClick={() => apiDeleteDepartment()}
    //       >
    //         Delete
    //       </button>
    //       <button className={styles.btnCancel} onClick={() => setOpen(false)}>
    //         Cancel
    //       </button>
    //     </div>
    //   </div>
    // </Modal>
  );
}
