import axios from "axios";
import styles from "./delete.module.css";
import { Modal, Button } from "antd";
export default function Delete(
  open: boolean,
  setOpen: Function,
  dataDep: any,
  handelReset:Function
) {
    const token = localStorage?.getItem("authToken")
    const apiDeleteDepartment = async() =>{
        try{
            const res = await axios.delete(
              `http://localhost:7295/api/Department/${dataDep?.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(res.data);
            if(res.data.statusCode === 200){
              alert('ok')
                handelReset()
                setOpen(false)
            }
            console.log(res)
        }
        catch(error){
            console.log(error)
        }
    }
  return (
    <Modal
      title="Delete Department"
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
      <p>Are you sure you want to delete the {dataDep?.name} department?</p>
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
    //       Are you sure you want to delete the {dataDep?.name} department?
    //     </p>
    //     <div className={styles.bodyBtn}>
    //       <button className={styles.btnLogout} onClick={() => apiDeleteDepartment()}>Delete</button>
    //       <button className={styles.btnCancel} onClick={() => setOpen(false)}>
    //         Cancel
    //       </button>
    //     </div>
    //   </div>
    // </Modal>
  );
}
