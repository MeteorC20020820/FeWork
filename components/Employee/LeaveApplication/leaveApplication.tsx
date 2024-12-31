"use client";
import styles from "./leaveApplication.module.css";
import SideBar from "../SideBar/sideBar";
import { useEffect, useState } from "react";
import axios from "axios";
import Delete from "./Delete/delete";
import Success from "../Alert/Success/success";
import Failed from "../Alert/Failed/failed";
export default function LeaveApplication() {
  const [user, setUser] = useState<any>({});
  const [userRoleP, setUserRoleP] = useState<any>({});
  const token = localStorage.getItem("authToken");
  const [leaves, setLeaves] = useState<any[]>([]);
  const [modalDelete, setModalDelete] = useState(false);
  const [idLeave, setIdLeave] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "processed">("pending");
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)
  const [message, setMessage] = useState<any>(null)
  useEffect(() => {
    const apiGetLeave = async () => {
      try {
        const res = await axios.get("http://localhost:7295/api/LeaveReq", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaves(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    apiGetLeave();
  }, [token]);

  const pendingLeaves = leaves.filter((leave) => leave.status === 0);
  const processedLeaves = leaves.filter((leave) => leave.status !== 0);

  const handleApprove = async (id: number) => {
    try {
      const res = await axios.put(
        `http://localhost:7295/api/LeaveReq/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if(res.status == 200){
        setSuccess(true)
        setMessage('Leave application approved successfully!')
        setLeaves((prevLeaves) =>
          prevLeaves.map((leave) =>
            leave.id === id ? { ...leave, status: 1 } : leave
          )
        );
      }
    } catch (error) {
      console.error(error);
      setFailed(true)
        setMessage('Resignation application failed!')
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await axios.put(
        `http://localhost:7295/api/LeaveReq/reject/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res)
      if(res.status == 200){
        setSuccess(true)
        setMessage('Rejected leave application successfully')
        setLeaves((prevLeaves) =>
          prevLeaves.map((leave) =>
            leave.id === id ? { ...leave, status: -1 } : leave
          )
        );
      }
    } catch (error) {
      console.error(error);
      setFailed(true)
      setMessage('Rejection of leave application failed!')
    }
  };

  const renderLeaves = (leavesList: any[]) =>
    leavesList
      .slice()
      .reverse()
      .map((leave) => (
        <li key={leave.id} className={styles.listItem}>
          <div className={styles.leftContent}>
            <p>
              <strong>Name:</strong> {leave.employee.fullName}
            </p>
            <p>
              <strong>Position:</strong> {leave.employee.position}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(leave.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Reason:</strong> {leave.reason}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(leave.createdAt).toLocaleString()}
            </p>
          </div>
          <div className={styles.rightContent}>
            {leave.status === 0 ? (
              <div className={styles.buttons}>
                <button
                  className={styles.approveButton}
                  onClick={() => handleApprove(leave.id)}
                >
                  Approve
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={() => handleReject(leave.id)}
                >
                  Reject
                </button>
              </div>
            ) : (
              <p
                className={
                  leave.status === 1
                    ? styles.approveButton
                    : styles.rejectButton
                }
              >
                <strong>
                  {leave.status === 1 ? "Approved" : "Rejected"}
                </strong>
              </p>
            )}
          </div>
        </li>
      ));

  return (
    <div style={{ display: "flex", backgroundColor:'#ccc', height:'100vh' }}>
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div style={{ width: "18%" }}></div>
      <div className={styles.bodyleave}>
        <div className={styles.header}>
          <p className={styles.titleDep}>Leave Applications</p>
        </div>
        <div style={{padding:"50px 80px"}}>
          <div style={{borderRadius:'20px', backgroundColor:'white', padding:'20px 30px'}}>
            <div className={styles.tabs}>
              <div
                className={`${styles.tab} ${
                  activeTab === "pending" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("pending")}
              >
                Pending
              </div>
              <div
                className={`${styles.tab} ${
                  activeTab === "processed" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("processed")}
              >
                Processed
              </div>
            </div>
            <ul className={styles.list}>
              {activeTab === "pending"
                ? renderLeaves(pendingLeaves)
                : renderLeaves(processedLeaves)}
            </ul>
          </div>
        </div>
      </div>
      {Delete(modalDelete, setModalDelete, idLeave)}
      <Success success ={success} setSuccess={setSuccess} message={message}/>
      <Failed failed ={failed} setFailed={setFailed} message={message}/>
    </div>
  );
}
