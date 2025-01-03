import axios from "axios";
import styles from "./delete.module.css";
import { Modal, Button } from "antd";
import { useEffect, useState } from "react";
import Loading from "@/components/Employee/Alert/Loading/loading";
const apiAi = process.env.NEXT_PUBLIC_API_AI
interface DeleteEmProp {
  open:boolean,
  setOpen:Function,
  dataEm:any,
  handelReset:Function,
  setSuccess:Function,
  setMessage:Function
}
export default function Delete({open, setOpen, dataEm, handelReset, setSuccess, setMessage}:DeleteEmProp) {
  const token = localStorage?.getItem("authToken");
  const [accUser, setAccUser] = useState<any>(null);
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState<any>(null)
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
    setLoading(true)
    setTitle("Processing employee deletion, please wait...");
    setOpen(false)
    try {
      const res = await axios.delete(
        `http://localhost:7295/api/Employee/${dataEm?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res)
      if (res.status == 200) {
        if(accUser !== null){
          const formData = new FormData();
          formData.append("face_id", accUser.face_id);
          const deleteFace = await axios.delete(`${apiAi}delete`,{data:formData})
          if(deleteFace.data.statusCode == 200){
            setLoading(false)
            setTitle('')
            setSuccess(true)
            setMessage('Delete employee and employee account successfully!')
          }
          console.log(deleteFace)
        }
        else{
          setSuccess(true)
          setMessage('Delete employee successfully!')
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
