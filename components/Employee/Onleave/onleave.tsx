"use client";
import { useEffect, useState } from "react";
import SideBar from "../SideBar/sideBar";
import styles from "./onleave.module.css";
import axios from "axios";
import Delete from "./Delete/delete";
import Success from "../Alert/Success/success";
import Failed from "../Alert/Failed/failed";
import Note from "../Alert/Note/note";
export default function Onleave() {
  const [user, setUser] = useState<any>({});
  const [userRoleP, setUserRoleP] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"create" | "view">("create"); 
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [modelDelete, setModalDelete] = useState(false)
  const [idLeave, setIdLeave] = useState<any>(null)
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)
  const [note, setNote] = useState(false)
  const [message, setMessage] = useState<any>(null)
    const token = localStorage.getItem("authToken");
  // Xử lý gửi đơn xin nghỉ
  const handleFormSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newRequest = {
      reason: formData.get("leaveReason"),
      date: formData.get("startDate"),
    };
    try{
      const res = await axios.post(
        "http://localhost:7295/api/LeaveReq",
        newRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(res.status == 200){
        setSuccess(true)
        setMessage("Create leave application successfully!");
        reset()
      }
    } 
    catch(error){
      setNote(true)
      setMessage("Note: You need to request leave at least 3 days in advance from the date of submission, and leave requests cannot be made for Saturday and Sunday.")
      console.log(error)
    }  
  };
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
          <label htmlFor="startDate">Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
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
  const apiGetLeave = async()=>{
    try{
      const res = await axios.get(
        "http://localhost:7295/api/LeaveReq/GetRequestByEmployee",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res)
      setLeaveRequests(res.data.data)
    }
    catch(error){
      console.log(error)
    }
  }
  const reset =()=>{
    apiGetLeave()
  }
  useEffect(()=>{
    apiGetLeave()
  },[token])
  const changeDate = (text:any) =>{
    const date = new Date(text);
    return date.toLocaleDateString("vi-VN")
  }
  const ViewLeaveRequests = () => (
    <div className={styles.requestList}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h2 className={styles.titleCreate}>List of leave applications</h2>
      </div>

      {leaveRequests.slice().reverse().map((request, index) => (
        <li key={index} className={styles.requestItem}>
          <div className={styles.infoContainer}>
            <div className={styles.header}>
              {request.status === 0 && (
                <button
                  className={styles.closeButton}
                  onClick={() => {
                    setModalDelete(true), setIdLeave(request.id);
                  }}
                >
                  &times;
                </button>
              )}
            </div>
            <div className={styles.leftInfo}>
              <p>
                <strong>Fullname:</strong> {user.fullName}
              </p>
              <p>
                <strong>Position:</strong> {user.position}
              </p>
              <p>
                <strong>Phone number:</strong> {user.phone}
              </p>
              <p>
                <strong>Reason for leave:</strong> {request.reason}
              </p>
              <p>
                <strong>Date:</strong> {changeDate(request.date)}
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
      {Delete(modelDelete, setModalDelete, idLeave, setSuccess, setMessage, reset)}
    </div>
  );


  return (
    <div className={styles.bodyOnleave}>
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div style={{ width: "18%" }}></div>
      <div className={styles.right}>
        <div className={styles.headerx}>
          <p className={styles.titleHeader}>Onleave</p>
        </div>
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
        <div style={{padding:'0 80px 30px 80px'}}>
          <div className={styles.tabContent}>
            {activeTab === "create" && <CreateLeaveForm />}
            {activeTab === "view" && <ViewLeaveRequests />}
          </div>
        </div>
      </div>
      {<Success success ={success} setSuccess={setSuccess} message={message}/>}
      <Note note={note} setNote={setNote} message={message}/>
    </div>
  );
}
