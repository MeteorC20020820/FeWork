import axios from "axios";
import styles from "./account.module.css";
import { Modal } from "antd";
import { useEffect, useState } from "react";

export default function Account(open:boolean, setOpen:Function, dataEm:any) {
  const token = localStorage?.getItem("authToken");
  const [accUser, setAccUser] = useState<any>(null);

  useEffect(() => {
    if (dataEm?.id) {
      const ApiGetAccount = async () => {
        try {
          const res = await axios.get(
            `http://localhost:7295/api/Account/${dataEm.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(res.data);
          if (res.data.statusCode === 200) {
            setAccUser(res.data.data);
          } else {
            setAccUser(null);
          }
        } catch (error) {
          console.log("Error fetching account data:", error);
          setAccUser(null); 
        }
      };
      setAccUser(null);
      ApiGetAccount();
    }
  }, [token, dataEm?.id]);

  const role = (e: any) => {
    if (e === 1) {
      return "Manager";
    } else if (e === 2) {
      return "Admin";
    } else if (e === 3){
      return "User Employee";
    }
    else return null
  };

  console.log("Current accUser:", accUser);

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      width={600}
      closable={false}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
    >
      <div className={styles.account} style={{ color: "black" }}>
        <div>{accUser?.email}</div>
        <div>{role(accUser?.roleId)}</div>
      </div>
    </Modal>
  );
}
