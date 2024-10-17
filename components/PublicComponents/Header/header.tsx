"use client";
import { useRouter } from "next/navigation";
import styles from "./header.module.css";
import { usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

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
          onClick={() => router.push("/Home")}
        >
          Home
        </p>
        <p
          className={`${styles.textTab} ${
            pathname === "/About" ? styles.activeTab : ""
          }`}
          onClick={() => router.push("/About")}
        >
          About
        </p>
        <p
          className={`${styles.textTab} ${
            pathname === "/Recruitment" ? styles.activeTab : ""
          }`}
          onClick={() => router.push("/Recruitment")}
        >
          Recruitment
        </p>
        <p
          className={`${styles.textTab} ${
            pathname === "/Contact" ? styles.activeTab : ""
          }`}
          onClick={() => router.push("/Contact")}
        >
          Contact
        </p>
      </div>
      <div className={styles.login}>
        <button
          className={styles.btnLogin}
          onClick={() => router.push("/Login")}
        >
          LogIn
        </button>
      </div>
    </div>
  );
}
