import axios from "axios";
import styles from "./edit.module.css";
import { Modal } from "antd";
import { useEffect, useState } from "react";

export default function Edit(open: boolean, setOpen: Function, dataDep: any) {
  const token = localStorage?.getItem("authToken");
  console.log(token)
  const [name, setName] = useState<any>(dataDep?.name);
  const [descrip, setDescrip] = useState<any>(dataDep?.description);
  const [error, setError] = useState("")
  const [changeDep, setChangeDep] = useState<any>({})
  useEffect(() => {
    setName(dataDep?.name);
    setDescrip(dataDep?.description);
  }, [dataDep]);
  const changeName = (e: any) => {
    setName(e.target.value);
  };
  const changeDescrip = (e: any) => {
    setDescrip(e.target.value);
  };
  useEffect(() =>{
    setChangeDep({
      "name" : name,
      "description":descrip,
      "status":0
    })
  },[name, descrip])
  const apiEditDepartment = async () => {
    if (!name || !descrip) {
      setError("Please fill in all fields!");
      return; 
    }

    if (!token) {
      setError("Unauthorized! Please log in again.");
      return; 
    }
    try {
      const res = await axios.put(
        `http://localhost:7295/api/Department/${dataDep?.id}`,changeDep, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.statusCode === 200) {
        window.location.reload();
      } else {
        setError("Failed to update department.");
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
      <div className={styles.bodyEditModal}>
        <p className={styles.title}>Edit Department</p>
        <div className={styles.bodyEditForm}>
          <div className={styles.formGroup}>
            <label htmlFor="editName" className={styles.label}>
              Department Name:
            </label>
            <input
              id="editName"
              type="text"
              value={name}
              className={styles.inputDep}
              onChange={changeName}
              required
              placeholder="Enter department name..."
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editDescription" className={styles.label}>
              Description:
            </label>
            <input
              id="editDescription"
              type="text"
              value={descrip}
              className={styles.inputDep}
              onChange={changeDescrip}
              required
              placeholder="Enter description..."
            />
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.bodyBtn}>
          <button
            className={styles.btnSave}
            onClick={() => apiEditDepartment()}
          >
            Save
          </button>
          <button className={styles.btnCancel} onClick={() => setOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
