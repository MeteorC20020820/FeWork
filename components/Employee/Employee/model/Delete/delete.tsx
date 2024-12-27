import axios from "axios";
import styles from "./delete.module.css";
import { Modal, Button } from "antd";
import { useEffect, useState } from "react";
const apiAi = "https://b20dccn460.serveo.net/api/v1/";
export default function Delete(open: boolean, setOpen: Function, dataEm: any, handelReset:Function) {
  const token = localStorage?.getItem("authToken");
  const [accUser, setAccUser] = useState<any>(null);
  useEffect(() => {
    if (dataEm?.id) {
      const ApiGetAccount = async () => {
        try {
          const res = await axios.get(
            `http://localhost:7295/api/Account/GetAccountByEmployeeId/${dataEm?.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.data.statusCode === 200) {
            setAccUser(res.data.data);
          } else {
            setAccUser(null);
          }
        } catch (error) {
          console.error("Error fetching account data:", error);
          setAccUser(null);
        }
      };
      ApiGetAccount();
    }
  }, [token, dataEm?.id]);
  const apiDeleteDepartment = async () => {
    // if(accUser !== null){
    //   const formData = new FormData();
    //   formData.append("face_id", accUser.face_id);
    //   const deleteFace = await axios.delete(`${apiAi}delete`,{data:formData})
    //   console.log(deleteFace)
    // }
    try {
      const res = await axios.delete(
        `http://localhost:7295/api/Employee/${dataEm?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      if (res.data.statusCode == 200) {
        if(accUser !== null){
          const formData = new FormData();
          formData.append("face_id", accUser.face_id);
          const deleteFace = await axios.delete(`${apiAi}delete`,{data:formData})
          console.log(deleteFace)
        }
        handelReset()
        setOpen(false)
      }
      console.log(res);
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
      <p>Are you sure you want to delete employee: {dataEm?.fullName}?</p>
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
    //     <p className={styles.title}>Delete Department</p>
    //     <p className={styles.text}>
    //       Are you sure you want to delete the {dataEm?.fullName} employee?
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
