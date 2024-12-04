"use client";
import { useEffect, useState } from "react";
import SideBar from "../SideBar/sideBar";
import styles from "./onleave.module.css";

export default function Onleave() {
  const [user, setUser] = useState<any>({});
  const [userRoleP, setUserRoleP] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"create" | "view">("create"); // State để quản lý tab
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]); // State để lưu danh sách đơn xin nghỉ
    console.log(leaveRequests);
    console.log(user)
  // Xử lý gửi đơn xin nghỉ
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newRequest = {
      fullName: user.fullName,
      position: user.position,
      phone: user.phone,
      department: formData.get("department"),
      leaveReason: formData.get("leaveReason"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      status: 0,
    };

    setLeaveRequests([...leaveRequests, newRequest]);
    e.currentTarget.reset(); // Reset form sau khi gửi
    alert("Đơn xin nghỉ đã được gửi!");
  };

  // Giao diện cho phần Tạo đơn xin nghỉ
  const CreateLeaveForm = () => (
    <div className={styles.formContainer}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h2 className={styles.titleCreate}>Create Leave application</h2>
      </div>
      <form className={styles.leaveForm} onSubmit={handleFormSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Fullname:</label>
          <input
            value={user.fullName}
            disabled
            type="text"
            id="fullName"
            name="fullName"
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="position">Position:</label>
          <input
            value={user.position}
            disabled
            type="text"
            id="position"
            name="position"
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone number:</label>
          <input
            value={user.phone}
            disabled
            type="tel"
            id="phone"
            name="phone"
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            name="department"
            placeholder="Enter department..."
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="leaveReason">Reason for leave:</label>
          <textarea
            rows={4}
            id="leaveReason"
            name="leaveReason"
            placeholder="Please specify your reason for leave in the application..."
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="endDate">End date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className={styles.inputField}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Send
        </button>
      </form>
    </div>
  );
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Pending approval";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Không xác định";
    }
  };


  // Giao diện cho phần Xem đơn xin nghỉ
  const ViewLeaveRequests = () => (
    <div className={styles.requestList}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h2 className={styles.titleCreate}>List of leave applications</h2>
      </div>

      {leaveRequests.map((request, index) => (
        <li key={index} className={styles.requestItem}>
          <div className={styles.infoContainer}>
            <div className={styles.leftInfo}>
              <p>
                <strong>Fullname:</strong> {request.fullName}
              </p>
              <p>
                <strong>Position:</strong> {request.position}
              </p>
              <p>
                <strong>Department:</strong> {request.department}
              </p>
              <p>
                <strong>Phone number:</strong> {request.phone}
              </p>
              <p>
                <strong>Reason for leave:</strong> {request.leaveReason}
              </p>
              <p>
                <strong>Start date:</strong> {request.startDate}
              </p>
              <p>
                <strong>End date:</strong> {request.endDate}
              </p>
            </div>
            <div className={styles.statusCircle}>
              <span
                className={
                  request.status === 1
                    ? styles.statusApproved
                    : request.status === 2
                    ? styles.statusRejected
                    : styles.statusPending
                }
              >
                {getStatusLabel(request.status)}
              </span>
            </div>
          </div>
        </li>
      ))}
    </div>
  );


  return (
    <div className={styles.bodyOnleave}>
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div style={{ width: "18%" }}></div>
      <div className={styles.right}>
        {/* Thanh chuyển đổi tab */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "create" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("create")}
          >
            Leave application
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "view" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("view")}
          >
            Review the leave application
          </button>
        </div>

        {/* Nội dung tab */}
        <div className={styles.tabContent}>
          {activeTab === "create" && <CreateLeaveForm />}
          {activeTab === "view" && <ViewLeaveRequests />}
        </div>
      </div>
    </div>
  );
}
