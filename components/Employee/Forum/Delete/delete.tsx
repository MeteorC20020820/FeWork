import axios from "axios";
import styles from "./delete.module.css";
import { Modal, Button } from "antd";
export default function DeleteP(
  open: boolean,
  setOpen: Function,
  name:string,
  api:Function,
  dataDep: any
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
            if(res.data.statusCode == 200){
                alert("Delete department success!")
                window.location.reload()
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
          onClick={() => {api(dataDep?.id), setOpen(false)}}
        >
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete the {name} of {dataDep?.fullName}</p>
    </Modal>
  );
}
