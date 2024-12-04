"use client";
import styles from "./info.module.css";
import SideBar from "../SideBar/sideBar";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

export default function Info() {
  const [user, setUser] = useState<any>({});
  const [userRoleP, setUserRoleP] = useState<any>({});
  const [acc, setAcc] = useState<any>({})
  const [dep, setDep] = useState<any>(null);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const token = localStorage.getItem("authToken")
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  console.log(user)
  useEffect(() => {
    const ApiGetDep = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7295/api/Department/${user.departmentId}`
        );
        if (res.status === 200) {
          setDep(res.data.data.name);
        }
      } catch (error) {
        console.log(error);
      }
    };
    ApiGetDep();
  }, [user]);
  useEffect(() =>{
    const ApiGetAcc = async() =>{
      try{
          const res = await axios.get(
            `http://localhost:7295/api/Account/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(res.data.data)
          setAcc(res.data.data)
          
      }
            catch(error){
        console.log(error)
      }
    }
    ApiGetAcc()
  },[user])
  // Xử lý thay đổi mật khẩu
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:7295/api/Account/change-password/${acc.id}`,
        {
          "oldPassword": passwords.oldPassword,
          "newPassword": passwords.newPassword,
          "confirmPassword": passwords.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        alert("Password changed successfully!");
        setIsChangePassword(false); // Quay lại giao diện Profile
      }
    } catch (error) {
      console.error(error);
      alert("Failed to change password. Please try again.");
    }
  };

  return (
    <div>
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div className={styles.container}>
        <div className={styles.profileCard}>
          {/* Phần bên trái */}
          <div className={styles.profileLeft}>
            <img
              src="https://via.placeholder.com/100"
              alt="Avatar"
              className={styles.avatar}
            />
            <div className={styles.editPicture}>Edit Picture</div>
            <div className={styles.changePw}>
              <button
                className={styles.btnPw}
                onClick={() => setIsChangePassword(true)}
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Phần bên phải */}
          <div className={styles.profileRight}>
            {isChangePassword ? (
              // Giao diện Change Password
              <div>
                <div className={styles.title}>Change Password</div>
                <div className={styles.details}>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>Old Password:</label>
                    <div className={styles.passwordInputContainer}>
                      <input
                        type={showPasswords.oldPassword ? "text" : "password"}
                        className={styles.detailInput}
                        value={passwords.oldPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            oldPassword: e.target.value,
                          })
                        }
                      />
                      <span
                        className={styles.passwordToggle}
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            oldPassword: !showPasswords.oldPassword,
                          })
                        }
                      >
                        {showPasswords.oldPassword ? (
                          <EyeOutlined style={{color:'black'}} />
                        ) : (
                          <EyeInvisibleOutlined style={{color:'black'}} />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>New Password:</label>
                    <div className={styles.passwordInputContainer}>
                      <input
                        type={showPasswords.newPassword ? "text" : "password"}
                        className={styles.detailInput}
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            newPassword: e.target.value,
                          })
                        }
                      />
                      <span
                        className={styles.passwordToggle}
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            newPassword: !showPasswords.newPassword,
                          })
                        }
                      >
                        {showPasswords.newPassword ? (
                          <EyeOutlined style={{color:'black'}} />
                        ) : (
                          <EyeInvisibleOutlined style={{color:'black'}} />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>
                      Confirm Password:
                    </label>
                    <div className={styles.passwordInputContainer}>
                      <input
                        type={
                          showPasswords.confirmPassword ? "text" : "password"
                        }
                        className={styles.detailInput}
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <span
                        className={styles.passwordToggle}
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirmPassword: !showPasswords.confirmPassword,
                          })
                        }
                      >
                        {showPasswords.confirmPassword ? (
                          <EyeOutlined style={{color:'black'}} />
                        ) : (
                          <EyeInvisibleOutlined style={{color:'black'}} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.buttonRow}>
                  <button
                    className={styles.saveButton}
                    onClick={handleChangePassword}
                  >
                    Save Password
                  </button>
                  <button
                    className={styles.backButton}
                    onClick={() => setIsChangePassword(false)}
                  >
                    Back to Profile
                  </button>
                </div>
              </div>
            ) : (
              // Giao diện Profile Settings
              <div>
                <div className={styles.title}>Profile Settings</div>
                <div className={styles.details}>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>ID:</label>
                    <input
                      type="text"
                      className={styles.detailInput}
                      value={user.id}
                      readOnly
                    />
                  </div>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>Full Name:</label>
                    <input
                      type="text"
                      className={styles.detailInput}
                      value={user.fullName}
                      readOnly
                    />
                  </div>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>Address:</label>
                    <input
                      type="text"
                      className={styles.detailInput}
                      value={user.address}
                      readOnly
                    />
                  </div>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>Base Salary:</label>
                    <input
                      type="text"
                      className={styles.detailInput}
                      value={user.baseSalary}
                      readOnly
                    />
                  </div>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>Birthday:</label>
                    <input
                      type="text"
                      className={`${styles.detailInput} ${styles.datePicker}`}
                      value={user.birthday}
                      readOnly
                    />
                  </div>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>Department:</label>
                    <input
                      type="text"
                      className={styles.detailInput}
                      value={dep}
                      readOnly
                    />
                  </div>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>
                      Identification ID:
                    </label>
                    <input
                      type="text"
                      className={styles.detailInput}
                      value={user.identificationId}
                      readOnly
                    />
                  </div>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>Phone:</label>
                    <input
                      type="text"
                      className={styles.detailInput}
                      value={user.phone}
                      readOnly
                    />
                  </div>
                  <div className={styles.detailRow}>
                    <label className={styles.detailLabel}>Position:</label>
                    <input
                      type="text"
                      className={styles.detailInput}
                      value={user.position}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
