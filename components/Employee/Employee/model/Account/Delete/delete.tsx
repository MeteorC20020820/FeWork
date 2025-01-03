import axios from "axios";
import styles from "./delete.module.css";
import { Modal, Button } from "antd";
import { useEffect, useState } from "react";
const apiAi = process.env.NEXT_PUBLIC_API_AI;
interface DeleteProp {
  open:boolean,
  setOpenD:Function,
  setOpenAcc:Function
  dataEm:any,
  setLoading:Function,
  setTitle:Function,
  setSuccess:Function,
  setMessage:Function,
  handelReset:Function
}
export default function Delete(
  open:boolean,
  setOpenD:Function,
  setOpenAcc:Function,
  dataEm:any,
  setLoading:Function,
  setTitle:Function,
  setSuccess:Function,
  setMessage:Function,
  handelReset:Function

) {
  const token = localStorage?.getItem("authToken");
  console.log(dataEm)
  const deleteAcc = async() =>{
    const formData = new FormData();
    formData.append("face_id", dataEm.face_id);
    setLoading(true)
    setTitle(
      "Processing the deletion of the employee's account, please wait..."
    );
    setOpenD(false)
    setOpenAcc(false)
    try{
      const res = await axios.delete(`http://localhost:7295/api/Account/${dataEm?.id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(res)
      if(res.status == 200){
        const deleteFace = await axios.delete(`${apiAi}delete`,{data:formData})
        console.log(deleteFace)
        if(deleteFace.data.statusCode == 200){

          setLoading(false)
          setTitle('')
          setSuccess(true)
          setMessage('Delete account successfully!')
          handelReset()
        }
        else{
          setLoading(false);
          setTitle("");
        }
      }
    }
    catch(erorr){
      console.log(erorr)
    }
  }
  return (
    <Modal
      title="Delete Account"
      open={open}
      onCancel={()=>setOpenD(false)}
      footer={[
        <Button key="cancel" onClick={()=>setOpenD(false)}>
          Cancel
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          onClick={() => deleteAcc()}
        >
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete account: {dataEm?.email}?</p>
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
