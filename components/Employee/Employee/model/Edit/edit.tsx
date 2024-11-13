import axios from "axios";
import styles from "./edit.module.css";
import { Modal } from "antd";
import { useEffect, useState } from "react";

export default function Edit(open: boolean, setOpen: Function, dataEm: any) {
  const token = localStorage?.getItem("authToken");
  console.log(token);
  const [name, setName] = useState<any>(dataEm?.fullName);
  const [phone, setPhone] = useState<any>(dataEm?.phone);
  const [position, setPosition] = useState<any>(dataEm?.position)
  const [address, setAddess] = useState<any>(dataEm?.address)
  const [baseSalary, setBaseSalary] = useState<any>(dataEm?.baseSalary)
  const [error, setError] = useState("");
  const [changeDep, setChangeDep] = useState<any>({});
  const [formattedBirthday, setFormattedBirthday] = useState<string>("");
  useEffect(() => {
    if (dataEm?.birthday) {
      const [day, month, year] = dataEm.birthday.split("/"); 
      setFormattedBirthday(`${year}-${month}-${day}`);
    }
    setName(dataEm?.fullName);
    setPhone(dataEm?.phone);
    setPosition(dataEm?.position)
    setAddess(dataEm?.address)
    setBaseSalary(String(dataEm?.baseSalary));
  }, [dataEm]);
  const changeName = (e: any) => {
    setName(e.target.value);
  };
  const changeDescrip = (e: any) => {
    setPhone(e.target.value);
  };
  const changePos = (e:any) =>{
    setPosition(e.target.value)
  }
  const changeAddress = (e:any) =>{
    setPhone(e.target.value)
  }
  const changeBase = (e:any) =>{
    setBaseSalary(e.target.value);
  }
  useEffect(() => {
    setChangeDep({
      "fullName": "Nguyễn văn A",
      "phone": "01234",
      "position": "position",
      "address": "address",
      "baseSalary": parseInt(baseSalary),
      "status": 0,
      "birthday": "dataEm?.birthday",
      "departmentId": 8,
      "identificationId": "dataEm?.identificationId",
    });
  }, [name, phone, position, address, baseSalary, dataEm]);
  const apiEditDepartment = async () => {
    if (!name || !phone||!position||!address||!baseSalary) {
      setError("Please fill in all fields!");
      return;
    }

    if (!token) {
      setError("Unauthorized! Please log in again.");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:7295/api/Employee/${dataEm?.id}`,
        changeDep,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.statusCode === 200) {
        window.location.reload();
      } else {
        setError("Failed to update employee.");
      }

      console.log(res);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while updating the department.");
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
        <p className={styles.title}>Edit Employee</p>
        <div className={styles.bodyEdit}>
          <input type="text" disabled value={dataEm?.departmentId} required className={styles.inputDep}/>
          <input
            type="text"
            value={name}
            className={styles.inputDep}
            onChange={changeName}
            required
            placeholder="Enter employee name..."
          />
          <input
            type="text"
            value={phone}
            className={styles.inputDep}
            onChange={changeDescrip}
            required
            placeholder="Enter employee phone..."
          />
          <input
            type="date"
            value={formattedBirthday}
            className={styles.inputDep}
            disabled
            required
          />
          <input
            type="text"
            value={dataEm?.identificationId}
            disabled
            required
            className={styles.inputDep}
          />
          <input
            type="text"
            value={address}
            onChange={changeAddress}
            required
            className={styles.inputDep}
          />
          <input
            type="text"
            value={position}
            onChange={changePos}
            required
            className={styles.inputDep}
          />
          <input
            type="text"
            value={baseSalary}
            onChange={changeBase}
            required
            className={styles.inputDep}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.bodyBtn}>
          <button
            className={styles.btnLogout}
            onClick={() => apiEditDepartment()}
          >
            Edit
          </button>
          <button className={styles.btnCancel} onClick={() => setOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
