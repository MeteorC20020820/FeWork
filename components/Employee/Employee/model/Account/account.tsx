import axios from "axios";
import styles from "./account.module.css";
import { Modal } from "antd";
import { useEffect, useState } from "react";

export default function Account(open:boolean, setOpen:Function, dataEm:any) {
  const token = localStorage?.getItem("authToken");
  const [accUser, setAccUser] = useState<any>(null);
  const [pw, setPw] = useState<any>(null)
  console.log(accUser)
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
      setAccUser(null);
      ApiGetAccount();
    }
  }, [token, dataEm?.id]);
  const ApiResetPw = async() =>{
    try{
        const res = await axios.post(
          `http://localhost:7295/api/Account/reset-password/${accUser.id}`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );
        console.log(res)
        if(res.status == 200){
          alert("New password is: " + res.data.data)
        }    
    }
    catch(error){
      console.log(error)
    }
  }
  const role = (e: any) => {
    if (e === 1) return "Manager";
    if (e === 2) return "Admin";
    if (e === 3) return "User Employee";
    return "Unknown";
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      width={500}
      closable={false}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
    >
      <div className={styles.account}>
        <div className={styles.profileCard}>
          <img
            src={accUser?.avatarUrl}
            alt="Avatar"
            className={styles.avatar}
          />
          <p className={styles.name}>
            {accUser?.email || "No Email Available"}
          </p>
          <p className={styles.role}>{role(accUser?.roleId)}</p>
          <div className={styles.buttons}>
            <button
              className={`${styles.button} ${styles.reset}`}
              onClick={() => ApiResetPw()}
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
