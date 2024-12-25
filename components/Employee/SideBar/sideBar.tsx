"use client";
import { useState, useEffect } from "react";
import styles from "./sideBar.module.css";
import {
  Setting,
  Forum,
  OnLeave,
  WorkSchedules,
  Timekeeping,
  Logout,
  Department,
  Employee,Asset,LeaveApplication
} from "@/components/icon/icon";
import { useRouter, usePathname } from "next/navigation";
import LogOut from "../Logout/logout";
import axios from "axios";
const size = "30px"
function getUserInfoFromToken(){
  const token = localStorage.getItem("authToken")
  if (!token) {
        return null;
    }
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    
    return decodedPayload; 
}
export default function SideBar({setUser, setUserRoleP}:any) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const token = localStorage.getItem("authToken");
  const [modalLogout, setModalLogout] = useState(false);
   const [userRole, setUserRole] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [idUser, setIdUser] = useState<number | null>(null );
  const [userI, setUserI] = useState<any>({})
  const [loading, setLoading] = useState(false); // Thêm state loading
  const [acc, setAcc] = useState<any>({})
  // Hàm điều hướng với loading
  const handleNavigation = (path: string) => {
    setLoading(true); // Bật loading khi bắt đầu điều hướng
    router.push(path);
    setTimeout(() => setLoading(false), 1000); // Tắt loading sau khi điều hướng (hoặc xử lý tại sự kiện onRouteChangeComplete)
  };
  useEffect(() =>{
    const user = getUserInfoFromToken();
    if(user){
      setUserInfo(user)
    }
    else{
      router.push("/Login")
    }
  },[router])
  useEffect(() => {
    if (userInfo) {
      setIdUser(userInfo.EmployeeId);
      setUserRole(
        userInfo["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      );
      setUserRoleP(
        userInfo["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      );
    }
  }, [userInfo]);
  useEffect(() =>{
    const apiGetUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7295/api/Employee/${idUser}`
        );
        setUserI(res.data.data)
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    apiGetUser() 
  },[idUser])

  useEffect(() =>{
    const apiGetAcc = async() =>{
      try{
        const res = await axios.get(
          `http://localhost:7295/api/Account/GetAccountByEmployeeId/${userI?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAcc(res.data.data)
      }
      catch(error){
        console.log(error)
      }
    }
    apiGetAcc()
  },[userI])
  const getIconColor = (iconName: string) => {
    if (pathname.toLowerCase() === `/employee/${iconName.toLowerCase()}`) {
      return "black";
    }
    return hoveredIcon === iconName.toLowerCase() ? "black" : "white";
  };

  const getFeatureClass = (iconName: string) => {
    return pathname.toLowerCase() === `/employee/${iconName.toLowerCase()}`
      ? `${styles.feature} ${styles.active}`
      : styles.feature;
  };

  const getTextFeatureClass = (iconName: string) => {
    return pathname.toLowerCase() === `/employee/${iconName.toLowerCase()}`
      ? `${styles.textFeature} ${styles.activeText}`
      : `${styles.textFeature}`;
  };
  return (
    <div className={styles.bodySideBar}>
      <div>
        <div className={styles.bodyInfo}>
          <div className={styles.info}>
            <img
              src={`${acc.avatarUrl}`}
              alt=""
              className={styles.imgEmployee}
            />
            <div className={styles.infoName}>
              <p className={styles.textName}>{userI.fullName}</p>
              <p className={styles.textName}>{userI.position}</p>
            </div>
          </div>
          <div
            className={getFeatureClass("Info")}
            onMouseEnter={() => {
              if (pathname !== "/Employee/Info")
                setHoveredIcon("info");
            }}
            onMouseLeave={() => setHoveredIcon(null)}
            onClick={() => handleNavigation("/Employee/Info")}
          >
            <Setting color={getIconColor("info")} width="40px" height="40px" />
            <p className={getTextFeatureClass("info")}>Setting</p>
          </div>
        </div>
        <div >
          {userRole === "2" &&(
            <div>
              <p className={styles.titleFeature}>Feature</p>
              <div className={styles.bodyF}>
                {/* Thẻ Forum */}
              <div
                className={getFeatureClass("Forum")}
                onMouseEnter={() => {
                  if (pathname !== "/Employee/Forum") setHoveredIcon("forum");
                }}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => handleNavigation("/Employee/Forum")}
              >
            
                <p className={getTextFeatureClass("forum")}>Forum</p>
              </div>

              {/* Thẻ OnLeave */}
              <div
                className={getFeatureClass("Onleave")}
                onMouseEnter={() => {
                  if (pathname !== "/Employee/Onleave") setHoveredIcon("onleave");
                }}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => handleNavigation("/Employee/Onleave")}
              >
                <p className={getTextFeatureClass("onleave")}>On leave</p>
              </div>

              {/* Thẻ WorkSchedules */}
              <div
                className={getFeatureClass("Workshedule")}
                onMouseEnter={() => {
                  if (pathname !== "/Employee/Workshedule")
                    setHoveredIcon("workshedule");
                }}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => handleNavigation("/Employee/Workshedule")}
              >
                <p className={getTextFeatureClass("workshedule")}>Work schedule</p>
              </div>

              {/* Thẻ Timekeeping */}
              <div
                className={getFeatureClass("Timekeeping")}
                onMouseEnter={() => {
                  if (pathname !== "/Employee/Timekeeping")
                    setHoveredIcon("timekeeping");
                }}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => handleNavigation("/Employee/Timekeeping")}
              >
                <p className={getTextFeatureClass("timekeeping")}>Timekeeping</p>
              </div>
              </div>
            </div>
          )}
          {(userRole === "1") && (
            <div>
              <p className={styles.titleFeature}>Manage</p>
              {/* Thẻ Forum */}
              <div
                className={getFeatureClass("Forum")}
                onMouseEnter={() => {
                  if (pathname !== "/Employee/Forum") setHoveredIcon("forum");
                }}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => handleNavigation("/Employee/Forum")}
              >
                {/* <Forum color={getIconColor("forum")} width="30px" height="30px" /> */}
                <p className={getTextFeatureClass("forum")}>Forum</p>
              </div>
              <div>
                <div
                  className={getFeatureClass("Department")}
                  onMouseEnter={() => {
                    if (pathname !== "/Employee/Department")
                      setHoveredIcon("department");
                  }}
                  onMouseLeave={() => setHoveredIcon(null)}
                  onClick={() => handleNavigation("/Employee/Department")}
                >
                  {/* <Department
                    color={getIconColor("department")}
                    width={size}
                    height={size}
                  /> */}
                  <p className={getTextFeatureClass("department")}>
                    Department
                  </p>
                </div>
                <div
                  className={getFeatureClass("Employee")}
                  onMouseEnter={() => {
                    if (pathname !== "/Employee/Employee")
                      setHoveredIcon("employee");
                  }}
                  onMouseLeave={() => setHoveredIcon(null)}
                  onClick={() => handleNavigation("/Employee/Employee")}
                >
                  {/* <Employee
                    color={getIconColor("employee")}
                    width={size}
                    height={size}
                  /> */}
                  <p className={getTextFeatureClass("employee")}>Employee</p>
                </div>
              </div>
              <div
                className={getFeatureClass("Asset")}
                onMouseEnter={() => {
                  if (pathname !== "/Employee/Asset") setHoveredIcon("asset");
                }}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => handleNavigation("/Employee/Asset")}
              >
                {/* <Asset
                  color={getIconColor("asset")}
                  width={size}
                  height={size}
                /> */}
                <p className={getTextFeatureClass("asset")}>Asset</p>
              </div>
              <div
                className={getFeatureClass("LeaveApplication")}
                onMouseEnter={() => {
                  if (pathname !== "/Employee/LeaveApplication")
                    setHoveredIcon("LeaveApplication");
                }}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => handleNavigation("/Employee/LeaveApplication")}
              >
                {/* <LeaveApplication
                  color={getIconColor("LeaveApplication")}
                  width={size}
                  height={size}
                /> */}
                <p className={getTextFeatureClass("LeaveApplication")}>
                  LeaveApplication
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thẻ Logout */}
      <div
        className={getFeatureClass("logout")}
        onMouseEnter={() => setHoveredIcon("logout")}
        onMouseLeave={() => setHoveredIcon(null)}
        onClick={() => setModalLogout(true)}
      >
        <Logout color={getIconColor("logout")} width={size} height={size} />
        <p className={getTextFeatureClass("logout")}>LogOut</p>
      </div>
      {LogOut(modalLogout, setModalLogout)}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
}
