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
const [modalDelete, setModalDelete] = useState(false)
const [idLeave, setIdLeave] = useState<any>(null)
  useEffect(() => {
    const apiGetLeave = async () => {
      try {
        const res = await axios.get("http://localhost:7295/api/LeaveReq", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res);
        setLeaves(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    apiGetLeave();
  }, [token]);

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
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:7295/api/LeaveReq/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar setUser={setUser} setUserRoleP={setUserRoleP} />
      <div style={{ width: "18%" }}></div>
      <div className={styles.bodyleave}>
        <h1 className={styles.header}>Leave Applications</h1>
        <ul className={styles.list}>
          {leaves
            .slice()
            .reverse()
            .map((leave) => (
              <li key={leave.id} className={styles.listItem}>
                <div className={styles.header}>
                  <button
                    className={styles.closeButton}
                    onClick={() => {setModalDelete(true), setIdLeave(leave.id)}}
                  >
                    &times;
                  </button>
                </div>
                <div className={styles.leftContent}>
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
            ))}
        </ul>
      </div>
      {Delete(modalDelete, setModalDelete, idLeave)}
    </div>
  );
}
