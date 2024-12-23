"use client";
import styles from "./leaveApplication.module.css";
import SideBar from "../SideBar/sideBar";
import { useEffect, useState } from "react";
import axios from "axios";
import Delete from "./Delete/delete";

export default function LeaveApplication() {
  const [user, setUser] = useState<any>({});
  const [userRoleP, setUserRoleP] = useState<any>({});
  const token = localStorage.getItem("authToken");
  const [leaves, setLeaves] = useState<any[]>([]);
  const [modalDelete, setModalDelete] = useState(false);
  const [idLeave, setIdLeave] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "processed">("pending");

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
      await axios.put(
        `http://localhost:7295/api/LeaveReq/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave.id === id ? { ...leave, status: 1 } : leave
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:7295/api/LeaveReq/reject/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave.id === id ? { ...leave, status: -1 } : leave
        )
      );
    } catch (error) {
      console.error(error);
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
    <div style={{ display: "flex" }}>
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div style={{ width: "18%" }}></div>
      <div className={styles.bodyleave}>
        <h1 className={styles.header}>Leave Applications</h1>
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
      {Delete(modalDelete, setModalDelete, idLeave)}
    </div>
  );
}
