"use client";
import { useState } from "react";
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

export default function SideBar() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  // Hàm để kiểm tra màu sắc của từng biểu tượng
  // Sửa lại tên icon cho đồng nhất về chữ thường
  const getIconColor = (iconName: string) => {
    console.log("check1"+pathname.toLowerCase());
    console.log("check2"+`/employee/${iconName.toLowerCase()}`);
    // Chuyển iconName và pathname về chữ thường để đảm bảo so sánh chính xác
    if (pathname.toLowerCase() === `/employee/${iconName.toLowerCase()}`) {
      return "black"; // Nếu đường dẫn trùng với iconName thì màu sẽ là đen
    }
    return hoveredIcon === iconName.toLowerCase() ? "black" : "white"; // Hover icon
  };

  // Hàm để áp dụng class active khi trang hiện tại khớp với iconName
  const getFeatureClass = (iconName: string) => {
    return pathname.toLowerCase() === `/employee/${iconName.toLowerCase()}`
      ? `${styles.feature} ${styles.active}`
      : styles.feature;
  };

  return (
    <div className={styles.bodySideBar}>
      <div>
        <div className={styles.bodyInfo}>
          <div className={styles.info}>
            <img src="" alt="" className={styles.imgEmployee} />
            <div>
              <p className={styles.textName}>Full name</p>
              <p className={styles.textName}>ID: 38283</p>
            </div>
          </div>
          <div onClick={() => router.push("/Employee/Info")}>
            <Setting color="white" width="40px" height="40px" />
          </div>
        </div>
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
            <p className={styles.textFeature}>Forum</p>
          </div>

          {/* Thẻ OnLeave */}
          <div
            className={getFeatureClass("Onleave")}
            onMouseEnter={() => {
              if (pathname !== "/Employee/Onleave") setHoveredIcon("onLeave");
            }}
            onMouseLeave={() => setHoveredIcon(null)}
            onClick={() => router.push("/Employee/Onleave")}
          >
            <OnLeave
              color={getIconColor("onLeave")}
              width="50px"
              height="50px"
            />
            <p className={styles.textFeature}>On leave</p>
          </div>

          {/* Thẻ WorkSchedules */}
          <div
            className={getFeatureClass("Workshedule")}
            onMouseEnter={() => {
              if (pathname !== "/Employee/Workshedule")
                setHoveredIcon("workSchedules");
            }}
            onMouseLeave={() => setHoveredIcon(null)}
            onClick={() => router.push("/Employee/Workshedule")}
          >
            <WorkSchedules
              color={getIconColor("workSchedules")}
              width="50px"
              height="50px"
            />
            <p className={styles.textFeature}>Work schedule</p>
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
            <p className={styles.textFeature}>Timekeeping</p>
          </div>
        </div>
      </div>

      {/* Thẻ Logout */}
      <div
        className={getFeatureClass("logout")}
        onMouseEnter={() => setHoveredIcon("logout")}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <Logout color={getIconColor("logout")} width="50px" height="50px" />
        <p className={styles.textFeature}>LogOut</p>
      </div>
    </div>
  );
}
