"use client";
import { useRouter } from "next/navigation";
import styles from "./header.module.css";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false); // Thêm state loading

  // Hàm điều hướng với loading
  const handleNavigation = (path: string) => {
    setLoading(true); // Bật loading khi bắt đầu điều hướng
    router.push(path);
    setTimeout(() => setLoading(false), 1000); // Tắt loading sau khi điều hướng (hoặc xử lý tại sự kiện onRouteChangeComplete)
  };
  return (
    <div className={styles.bodyHeader}>
      <div className={styles.logo}>
        <img src="./T1logo_square.png" alt="logoT1" width={100} height={100} />
      </div>
      <div className={styles.tabBar}>
        <p
          className={`${styles.textTab} ${
            pathname === "/Home" ? styles.activeTab : ""
          }`}
          onClick={() => handleNavigation("/Home")}
        >
          Home
        </p>
        <p
          className={`${styles.textTab} ${
            pathname === "/About" ? styles.activeTab : ""
          }`}
          onClick={() => handleNavigation("/About")}
        >
          About
        </p>
        <p
          className={`${styles.textTab} ${
            pathname === "/Recruitment" ? styles.activeTab : ""
          }`}
          onClick={() => handleNavigation("/Recruitment")}
        >
          Recruitment
        </p>
        <p
          className={`${styles.textTab} ${
            pathname === "/Contact" ? styles.activeTab : ""
          }`}
          onClick={() => handleNavigation("/Contact")}
        >
          Contact
        </p>
      </div>
      <div className={styles.login}>
        <button
          className={styles.btnLogin}
          onClick={() => handleNavigation("/Login")}
        >
          LogIn
        </button>
      </div>
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
