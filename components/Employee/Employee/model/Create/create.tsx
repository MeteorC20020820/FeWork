import axios from "axios";
import styles from "./create.module.css";
import { Modal } from "antd";
import { useEffect, useState } from "react";

export default function Create(open: boolean, setOpen: Function) {
  const token = localStorage?.getItem("authToken");
  const [name, setName] = useState<any>(null);
  const [phone, setPhone] = useState<any>(null);
  const [position, setPosition] = useState<any>(null);
  const [birthday, setBirthDay] = useState<any>(null);
  const [identificationId, setIdentificationId] = useState<any>(null);
  const [departmentId, setDepartmentId] = useState<any>(null);
  const [address, setAddess] = useState<any>(null);
  const [baseSalary, setBaseSalary] = useState<any>(null);
  const [error, setError] = useState("");
  const [changeDep, setChangeDep] = useState<any>({});
  const [formattedBirthday, setFormattedBirthday] = useState<string>("");
  const [dep, setDep] = useState<any[]>([]);

  const changeName = (e: any) => setName(e.target.value);
  const changeDescrip = (e: any) => setPhone(e.target.value);
  const changePos = (e: any) => setPosition(e.target.value);
  const changeAddress = (e: any) => setAddess(e.target.value);
  const changeBase = (e: any) => setBaseSalary(e.target.value);
  const changeIden = (e: any) => setIdentificationId(e.target.value);
  const changeBirth = (e: any) => setBirthDay(e.target.value);
  const changeIdde = (e: any) => setDepartmentId(e.target.value);
  const changeDepartment = (e: any) => {
    setDepartmentId(parseInt(e.target.value)); 
  };

  useEffect(() => {
    const apiGetDep = async () => {
      try {
        const res = await axios.get(`http://localhost:7295/api/Department`);
        setDep(res.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    apiGetDep();
  }, []);
  useEffect(() => {
    setChangeDep({
      fullName: name,
      phone: phone,
      birthday: birthday,
      identificationId: identificationId,
      position: position,
      address: address,
      baseSalary: parseInt(baseSalary),
      status: 0,
      departmentId: parseInt(departmentId),
    });
  }, [
    name,
    phone,
    position,
    address,
    baseSalary,
    birthday,
    departmentId,
    identificationId,
  ]);

  const apiEditDepartment = async () => {
    if (
      !name ||
      !phone ||
      !position ||
      !address ||
      !baseSalary ||
      !birthday ||
      !departmentId ||
      !identificationId
    ) {
      setError("Please fill in all fields!");
      return;
    }

    if (!token) {
      setError("Unauthorized! Please log in again.");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:7295/api/Employee`,
        changeDep,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      if (res.status === 200) {
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
  console.log(changeDep)
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
        <p className={styles.title}>Create Employee</p>
        <div className={styles.bodyEdit}>
          <div className={styles.inputWrapper}>
            <label htmlFor="name" className={styles.label}>
              Employee Name
            </label>
            <input
              type="text"
              value={name}
              className={styles.inputDep}
              onChange={changeName}
              required
              placeholder="Enter employee name..."
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              className={styles.inputDep}
              onChange={changeDescrip}
              required
              placeholder="Enter employee phone..."
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="birthday" className={styles.label}>
              Birthday
            </label>
            <input
              type="date"
              value={birthday}
              className={styles.inputDep}
              onChange={changeBirth}
              placeholder="Enter birthday..."
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="identificationId" className={styles.label}>
              Identification ID
            </label>
            <input
              type="text"
              value={identificationId}
              onChange={changeIden}
              placeholder="Enter identificationId employee..."
              required
              className={styles.inputDep}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="address" className={styles.label}>
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={changeAddress}
              placeholder="Enter Address..."
              required
              className={styles.inputDep}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="position" className={styles.label}>
              Position
            </label>
            <input
              type="text"
              value={position}
              onChange={changePos}
              required
              placeholder="Enter position..."
              className={styles.inputDep}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="baseSalary" className={styles.label}>
              Base Salary
            </label>
            <input
              type="number"
              value={baseSalary}
              onChange={changeBase}
              placeholder="Enter base salary..."
              required
              className={styles.inputDep}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="departmentId" className={styles.label}>
              Department ID
            </label>
            <select
              value={departmentId}
              id="department"
              onChange={changeDepartment}
              className={styles.inputDep}
              required
            >
              <option value="" disabled>
                Select Department
              </option>
              {dep.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.bodyBtn}>
          <button
            className={styles.btnLogout}
            onClick={() => apiEditDepartment()}
          >
            Create
          </button>
          <button className={styles.btnCancel} onClick={() => setOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
