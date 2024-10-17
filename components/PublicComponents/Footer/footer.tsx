'use client'
import { useRouter } from 'next/navigation';
import styles from './footer.module.css'
import { Facebook, Instagram, Youtube } from '@/components/icon/icon';
export default function Footer(){
  const router = useRouter()
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
                onClick={() => router.push("/About")}
              >
                About
              </p>
              <p
                className={styles.textCenter}
                onClick={() => router.push("/Recruitment")}
              >
                Recruitment
              </p>
              <p className={styles.textCenter} onClick={() => router.push("/Contact")}>Contact</p>
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
      </footer>
    );
}