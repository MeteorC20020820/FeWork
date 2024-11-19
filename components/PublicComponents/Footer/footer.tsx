'use client'
import { usePathname, useRouter } from 'next/navigation';
import styles from './footer.module.css'
import { Facebook, Instagram, Youtube } from '@/components/icon/icon';
import { useState } from 'react';
export default function Footer(){
  const router = useRouter()
  const pathname = usePathname;
  const [loading, setLoading] = useState(false); // Thêm state loading

  // Hàm điều hướng với loading
  const handleNavigation = (path: string) => {
    setLoading(true); // Bật loading khi bắt đầu điều hướng
    router.push(path);
    setTimeout(() => setLoading(false), 1000); // Tắt loading sau khi điều hướng (hoặc xử lý tại sự kiện onRouteChangeComplete)
  };
    return (
      <footer className={styles.bodyFooter}>
        <div className={styles.top}>
          <div className={styles.left}>
            <h1 className={styles.titleLeft}>FOLLOW US</h1>
            <div className={styles.iconLeft}>
              <Facebook />
              <Instagram />
              <Youtube />
            </div>
          </div>
          <div className={styles.center}>
            <h1 className={styles.titleCenter}>COMPANY</h1>
            <div className={styles.contentCenter}>
              <p
                className={styles.textCenter}
                onClick={() => handleNavigation("/About")}
              >
                About
              </p>
              <p
                className={styles.textCenter}
                onClick={() => handleNavigation("/Recruitment")}
              >
                Recruitment
              </p>
              <p
                className={styles.textCenter}
                onClick={() => handleNavigation("/Contact")}
              >
                Contact
              </p>
            </div>
          </div>
          <div className={styles.right}>
            <h1 className={styles.titleRight}>LEGAL</h1>
            <div className={styles.contentCenter}>
              <p className={styles.textCenter}>Terms of Use</p>
              <p className={styles.textCenter}>Regulations</p>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <img src="./T1logo_square.png" alt="T1" width={80} height={80} />
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
      </footer>
    );
}