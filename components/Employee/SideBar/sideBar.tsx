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
} from "@/components/icon/icon";
import { useRouter, usePathname } from "next/navigation";
import LogOut from "../Logout/logout";
import axios from "axios";
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
  const [modalLogout, setModalLogout] = useState(false);
   const [userRole, setUserRole] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [idUser, setIdUser] = useState<number | null>(null );
  const [userI, setUserI] = useState<any>({})
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
            <img src="" alt="" className={styles.imgEmployee} />
            <div>
              <p className={styles.textName}>{userI.fullName}</p>
              <p className={styles.textName}>{userI.position}</p>
            </div>
          </div>
          <div onClick={() => router.push("/Employee/Info")}>
            <Setting color="white" width="40px" height="40px" />
          </div>
        </div>
        {userRole === "3" && (
          <div>
            {/* Thẻ Forum */}
            <div
              className={getFeatureClass("Forum")}
              onMouseEnter={() => {
                if (pathname !== "/Employee/Forum") setHoveredIcon("forum");
              }}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => router.push("/Employee/Forum")}
            >
              <Forum color={getIconColor("forum")} width="50px" height="50px" />
              <p className={getTextFeatureClass("forum")}>Forum</p>
            </div>

            {/* Thẻ OnLeave */}
            <div
              className={getFeatureClass("Onleave")}
              onMouseEnter={() => {
                if (pathname !== "/Employee/Onleave") setHoveredIcon("onleave");
              }}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => router.push("/Employee/Onleave")}
            >
              <OnLeave
                color={getIconColor("onleave")}
                width="50px"
                height="50px"
              />
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
              onClick={() => router.push("/Employee/Workshedule")}
            >
              <WorkSchedules
                color={getIconColor("workshedule")}
                width="50px"
                height="50px"
              />
              <p className={getTextFeatureClass("workshedule")}>
                Work schedule
              </p>
            </div>

            {/* Thẻ Timekeeping */}
            <div
              className={getFeatureClass("Timekeeping")}
              onMouseEnter={() => {
                if (pathname !== "/Employee/Timekeeping")
                  setHoveredIcon("timekeeping");
              }}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => router.push("/Employee/Timekeeping")}
            >
              <Timekeeping
                color={getIconColor("timekeeping")}
                width="50px"
                height="50px"
              />
              <p className={getTextFeatureClass("timekeeping")}>Timekeeping</p>
            </div>
          </div>
        )}
        {userRole === "2" && (
          <div>
            {/* Thẻ Forum */}
            <div
              className={getFeatureClass("Forum")}
              onMouseEnter={() => {
                if (pathname !== "/Employee/Forum") setHoveredIcon("forum");
              }}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => router.push("/Employee/Forum")}
            >
              <Forum color={getIconColor("forum")} width="50px" height="50px" />
              <p className={getTextFeatureClass("forum")}>Forum</p>
            </div>

            {/* Thẻ OnLeave */}
            <div
              className={getFeatureClass("Onleave")}
              onMouseEnter={() => {
                if (pathname !== "/Employee/Onleave") setHoveredIcon("onleave");
              }}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => router.push("/Employee/Onleave")}
            >
              <OnLeave
                color={getIconColor("onleave")}
                width="50px"
                height="50px"
              />
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
              onClick={() => router.push("/Employee/Workshedule")}
            >
              <WorkSchedules
                color={getIconColor("workshedule")}
                width="50px"
                height="50px"
              />
              <p className={getTextFeatureClass("workshedule")}>
                Work schedule
              </p>
            </div>

            {/* Thẻ Timekeeping */}
            <div
              className={getFeatureClass("Timekeeping")}
              onMouseEnter={() => {
                if (pathname !== "/Employee/Timekeeping")
                  setHoveredIcon("timekeeping");
              }}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => router.push("/Employee/Timekeeping")}
            >
              <Timekeeping
                color={getIconColor("timekeeping")}
                width="50px"
                height="50px"
              />
              <p className={getTextFeatureClass("timekeeping")}>Timekeeping</p>
            </div>
            <div
              className={getFeatureClass("Department")}
              onMouseEnter={() => {
                if (pathname !== "/Employee/Department")
                  setHoveredIcon("department");
              }}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => router.push("/Employee/Department")}
            >
              <Timekeeping
                color={getIconColor("department")}
                width="50px"
                height="50px"
              />
              <p className={getTextFeatureClass("department")}>Department</p>
            </div>
          </div>
        )}
        {userRole === "1" && (
          <div>
            {/* Thẻ Forum */}
            <div
              className={getFeatureClass("Forum")}
              onMouseEnter={() => {
                if (pathname !== "/Employee/Forum") setHoveredIcon("forum");
              }}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => router.push("/Employee/Forum")}
            >
              <Forum color={getIconColor("forum")} width="50px" height="50px" />
              <p className={getTextFeatureClass("forum")}>Forum</p>
            </div>

            {/* Thẻ OnLeave */}
            <div
              className={getFeatureClass("Onleave")}
              onMouseEnter={() => {
                if (pathname !== "/Employee/Onleave") setHoveredIcon("onleave");
              }}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => router.push("/Employee/Onleave")}
            >
              <OnLeave
                color={getIconColor("onleave")}
                width="50px"
                height="50px"
              />
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
              onClick={() => router.push("/Employee/Workshedule")}
            >
              <WorkSchedules
                color={getIconColor("workshedule")}
                width="50px"
                height="50px"
              />
              <p className={getTextFeatureClass("workshedule")}>
                Work schedule
              </p>
            </div>

            {/* Thẻ Timekeeping */}
            <div
              className={getFeatureClass("Timekeeping")}
              onMouseEnter={() => {
                if (pathname !== "/Employee/Timekeeping")
                  setHoveredIcon("timekeeping");
              }}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => router.push("/Employee/Timekeeping")}
            >
              <Timekeeping
                color={getIconColor("timekeeping")}
                width="50px"
                height="50px"
              />
              <p className={getTextFeatureClass("timekeeping")}>Timekeeping</p>
            </div>
            <div
              className={getFeatureClass("Department")}
              onMouseEnter={() => {
                if (pathname !== "/Employee/Department")
                  setHoveredIcon("department");
              }}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => router.push("/Employee/Department")}
            >
              <Timekeeping
                color={getIconColor("department")}
                width="50px"
                height="50px"
              />
              <p className={getTextFeatureClass("department")}>Department</p>
            </div>
          </div>
        )}
      </div>

      {/* Thẻ Logout */}
      <div
        className={getFeatureClass("logout")}
        onMouseEnter={() => setHoveredIcon("logout")}
        onMouseLeave={() => setHoveredIcon(null)}
        onClick={() => setModalLogout(true)}
      >
        <Logout color={getIconColor("logout")} width="50px" height="50px" />
        <p className={getTextFeatureClass("logout")}>LogOut</p>
      </div>
      {LogOut(modalLogout, setModalLogout)}
    </div>
  );
}
