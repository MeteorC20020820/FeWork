import axios from "axios";
import styles from "./edit.module.css";
import { Modal } from "antd";
import { useEffect, useState } from "react";

export default function Edit(open: boolean, setOpen: Function, dataEm: any, handelReset:Function) {
  const token = localStorage?.getItem("authToken");
  const [name, setName] = useState<string>(dataEm?.fullName || "");
  const [phone, setPhone] = useState<string>(dataEm?.phone || "");
  const [position, setPosition] = useState<string>(dataEm?.position || "");
  const [address, setAddress] = useState<string>(dataEm?.address || "");
  const [baseSalary, setBaseSalary] = useState<any>(dataEm?.baseSalary);
  const changeBase = (e: any) => setBaseSalary(e.target.value);
  const [identificationId, setIdentificationId] = useState<any>(
    dataEm?.identificationId
  );
  const [error, setError] = useState<string>("");
  const [changeEm, setChangeEm] = useState<any>({});
  const [formattedBirthday, setFormattedBirthday] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<number | "">(
    dataEm?.departmentId || ""
  );
  const [dep, setDep] = useState<any[]>([]);
  const [gender, setGender] = useState<number>(dataEm?.gender || 0); // Thêm state giới tính

  useEffect(() => {
    if (dataEm?.departmentId) {
      setDepartmentId(dataEm.departmentId);
    }
    setIdentificationId(dataEm?.identificationId || "");
  }, [dataEm]);

  useEffect(() => {
    if (dataEm?.birthday) {
      const [day, month, year] = dataEm.birthday.split("/");
      setFormattedBirthday(`${year}-${month}-${day}`);
    }
    setName(dataEm?.fullName || "");
    setPhone(dataEm?.phone || "");
    setPosition(dataEm?.position || "");
    setAddress(dataEm?.address || "");
    setBaseSalary(dataEm?.baseSalary);
    setGender(dataEm?.gender || 0); // Cập nhật giới tính khi nhận dữ liệu
  }, [dataEm]);

  const changeDepartment = (e: any) => {
    setDepartmentId(parseInt(e.target.value));
  };

  useEffect(() => {
    const apiGetDep = async () => {
      try {
        const res = await axios.get(`http://localhost:7295/api/Department`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDep(res.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    apiGetDep();
  }, []);

  useEffect(() => {
    setChangeEm({
      fullName: name,
      phone: phone,
      imageUrl:"",
      position: position,
      address: address,
      identificationId: identificationId,
      baseSalary: baseSalary,
      gender: gender, // Thêm trường giới tính
      status: 0,
      birthday: formattedBirthday,
      departmentId: departmentId,
    });
  }, [
    name,
    phone,
    position,
    identificationId,
    address,
    baseSalary,
    departmentId,
    gender,
    dataEm,
    formattedBirthday,
  ]);

  const apiEditDepartment = async () => {
    if (
      !name ||
      !phone ||
      !position ||
      !address ||
      !baseSalary ||
      !departmentId ||
      gender === null // Kiểm tra nếu giới tính chưa được chọn
    ) {
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
        changeEm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.statusCode === 200) {
        alert('Edit employee success!')
        handelReset();
        setOpen(false)
      } else {
        setError("Failed to update employee.");
      }
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
          <div className={styles.inputWrapper}>
            <label htmlFor="departmentId" className={styles.label}>
              ID Employee
            </label>
            <input
              type="text"
              disabled
              value={dataEm?.id}
              required
              id="departmentId"
              className={styles.inputDep}
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="name" className={styles.label}>
              Employee Name
            </label>
            <input
              type="text"
              value={name}
              id="name"
              className={styles.inputDep}
              onChange={(e) => setName(e.target.value)}
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
              id="phone"
              className={styles.inputDep}
              onChange={(e) => setPhone(e.target.value)}
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
              value={formattedBirthday}
              id="birthday"
              className={styles.inputDep}
              onChange={(e) => setFormattedBirthday(e.target.value)}
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
              id="identificationId"
              onChange={(e) => setIdentificationId(e.target.value)}
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
              id="address"
              onChange={(e) => setAddress(e.target.value)}
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
              id="position"
              onChange={(e) => setPosition(e.target.value)}
              required
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
              id="baseSalary"
              onChange={changeBase}
              required
              className={styles.inputDep}
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="gender" className={styles.label}>
              Gender
            </label>
            <select
              value={gender}
              id="gender"
              onChange={(e) => setGender(Number(e.target.value))}
              className={styles.inputDep}
              required
            >
              <option value={0}>Female</option>
              <option value={1}>Male</option>
            </select>
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="department" className={styles.label}>
              Department
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
