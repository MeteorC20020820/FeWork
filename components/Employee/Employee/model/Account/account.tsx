import axios from "axios";
import styles from "./account.module.css";
import { Modal, Input, Select } from "antd";
import { useEffect, useState } from "react";

export default function Account(open: boolean, setOpen: Function, dataEm: any) {
  const token = localStorage?.getItem("authToken");
  const [accUser, setAccUser] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    email: "",
    password: "",
    avatarFile: null as File | null,
    faceFile: null as File | null,
    status: 1,
    employeeId: dataEm?.id || "",
    roleId: 3,
  });

  // Update employeeId when dataEm changes
  useEffect(() => {
    if (dataEm?.id) {
      setNewAccount((prev) => ({ ...prev, employeeId: dataEm.id }));
    }
  }, [dataEm]);

  // Fetch existing account
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

  // API to upload image and return its URL
  const apiChangeImage = async (file: File | null): Promise<string | null> => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "http://localhost:7295/api/FileUpload/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };
  const ApiChangePw = async() =>{
    if (!token) {
      console.error("Token is missing. Please log in.");
      return;
    }
    try{
      const res = await axios.post(
        `http://localhost:7295/api/Account/reset-password/${accUser?.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data.data)
      if(res.status == 200){
        alert("Password is: " + res.data.data)
      }
    }
    catch(error){
      console.log(error)
    }
  }
  const ApiCreateAccount = async () => {
    try {
      const avatarUrl = await apiChangeImage(newAccount.avatarFile);
      const faceUrl = await apiChangeImage(newAccount.faceFile);

      if (!avatarUrl || !faceUrl) {
        alert("Failed to upload files. Please try again.");
        return;
      }

      const payload = {
        email: newAccount.email,
        password: newAccount.password,
        avatarUrl: avatarUrl,
        faceUrl: faceUrl,
        status: newAccount.status,
        employeeId: newAccount.employeeId,
        roleId: newAccount.roleId,
      };
      console.log(payload)
      const res = await axios.post(
        `http://localhost:7295/api/Account`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        alert("Account created successfully!");
        setIsCreateModalOpen(false);
        setNewAccount({
          email: "",
          password: "",
          avatarFile: null,
          faceFile: null,
          status: 1,
          employeeId: dataEm?.id || "",
          roleId: 3,
        });
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account.");
    }
  };

  const role = (e: any) => {
    if (e === 1) return "Manager";
    if (e === 2) return "Admin";
    if (e === 3) return "User Employee";
    return "Unknown";
  };
  console.log(accUser)
  return (
    <>
      {/* Modal to view or create account */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        width={500}
        closable={false}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <div className={styles.account}>
          {accUser ? (
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
              <button className={styles.button} onClick={() => ApiChangePw()}>
                Reset Password
              </button>
            </div>
          ) : (
            <div className={styles.noAccount}>
              <p>No account found for this employee.</p>
              <button
                className={`${styles.button} ${styles.create}`}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal to create account */}
      <Modal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        title="Create Account"
        okText="Create"
        onOk={ApiCreateAccount}
      >
        <div className={styles.createAccountForm}>
          <div className={styles.inputField}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={newAccount.email}
              onChange={(e) =>
                setNewAccount({ ...newAccount, email: e.target.value })
              }
            />
          </div>
          <div className={styles.inputField}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={newAccount.password}
              onChange={(e) =>
                setNewAccount({ ...newAccount, password: e.target.value })
              }
            />
          </div>
          <div className={styles.fileInputContainer}>
            <label htmlFor="avatarFile">Avatar</label>
            <input
              id="avatarFile"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewAccount({
                  ...newAccount,
                  avatarFile: e.target.files?.[0] || null,
                })
              }
            />
          </div>
          <div className={styles.fileInputContainer}>
            <label htmlFor="faceFile">Face Image</label>
            <input
              id="faceFile"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewAccount({
                  ...newAccount,
                  faceFile: e.target.files?.[0] || null,
                })
              }
            />
          </div>
          <div className={styles.selectContainer}>
            <label>Role</label>
            <select
              value={newAccount.roleId}
              onChange={(e) =>
                setNewAccount({
                  ...newAccount,
                  roleId: parseInt(e.target.value, 10),
                })
              }
            >
              <option value={1}>Manager</option>
              <option value={2}>Admin</option>
              <option value={3}>User Employee</option>
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}
