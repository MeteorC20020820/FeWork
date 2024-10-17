'use client'
import { title } from 'process';
import styles from './home.module.css'
import { ArrowRight, Eye, Send, Face } from '@/components/icon/icon';
import { Card } from 'antd';
import { useRouter } from 'next/navigation';
const content2 = [
  {
    id: 1,
    icon:<Eye/>,
    title: "Vison",
    content:
      "T1 aims to lead the puzzle game genre in the mobile entertainment industry, thereby affirming its potential and position worldwide.",
    img: "/image1.jpg",
  },
  {
    id: 2,
    icon:<Send/>,
    title: "Mission",
    content:
      "T1's mission is to bring joy to everyone in the places T1 touches on the World map.",
    img: "/image2.jpg",
  },
  {
    id: 3,
    icon:<Face/>,
    title: "Core Values",
    content:
      "Always striving to create quality products, enhance experiences and respect the emotions of players are always the guiding principles for all activities of T1",
    img: "/image3.jpg",
  },
];
export default function Home(){
    const router = useRouter()
    return (
      <div className={styles.home}>
        <div className={styles.about}>
          <div className={styles.leftAbout}>
            <h1 className={styles.titleLeft}>Hello World!</h1>
            <p className={styles.textLeft}>
              As one of the leading puzzle game development companies in
              Vietnam, Sonat always strives to bring quality products and great
              gaming experiences, spreading joy to all over the World.
            </p>
            <button
              className={styles.btnLeft}
              onClick={() => router.push("/About")}
            >
              Learn about us {<ArrowRight color={"white"} />}
            </button>
          </div>
          <div className={styles.rightAbout}>
            <img
              src="./company2.png"
              alt="company"
              className={styles.imgRight}
            />
          </div>
        </div>
        <div className={styles.content2}>
          <div className={styles.bodyCtn2}>
            <h1 className={styles.titleCtn2}>
              Value comes from Simplicity and Appeal
            </h1>
            <div className={styles.bodyContentCtn2}>
              <p className={styles.contentCtn2}>
                With the desire to bring the most relaxing moments to everyone
                around the world, Sonat focuses on simple game lines that can be
                easily played anytime, anywhere, suitable for all ages
              </p>
            </div>
          </div>
          <div className={styles.bodyCardCtn2}>
            {content2.map((ctn) => (
              <div
                key={ctn.id}
                className={styles.cardCtn2}
                style={{
                  backgroundImage: `url(${ctn.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className={styles.iconCtn2}>{ctn.icon}</div>
                <div className={styles.ctn2}>
                  <p className={styles.titleCardCtn2}>{ctn.title}</p>
                  <p className={styles.textCardCtn2}>{ctn.content}</p>
                </div>
                <button className={styles.btnCardCtn2}>
                  Read more {<ArrowRight color={"rgb(1, 22, 114)"} />}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.culture}>
          <div className={styles.bodyTitleCulture}>
            <h1 className={styles.titleCulture}>
              Culture T1 is formed from People
            </h1>
            <div className={styles.bodyContentCul}>
              <p className={styles.contentCul}>
                T1 always aims to build a fair and open working environment.
                Here, everyone can maximize their abilities and passion. You
                will have companions in your career, together enjoying the
                achievements worthy of your contributions.
              </p>
            </div>
          </div>
          <div className={styles.imgCulture}>
            <div className={styles.leftImgCul}>
              <img src="./t1-vd.jpg" alt="t11" className={styles.imgL} />
            </div>
            <div className={styles.rightImgCul}>
              <div className={styles.topRightImgCul}>
                <img src="./t1r.jpg" alt="t1r" className={styles.imgTr} />
              </div>
              <div className={styles.btmRightImgCul}>
                <img src="./logot1.jpg" alt="logot1" className={styles.imgBr} />
              </div>
              <button
                className={styles.btnCul}
                onClick={() => router.push("/About")}
              >
                Learn about us {<ArrowRight color="white" />}
              </button>
            </div>
          </div>
        </div>
        <div className={styles.contact}>
          <div className={styles.leftCtt}>
            <h1 className={styles.titleContact}>Contact</h1>
            <p className={styles.contentContact}>
              If you need support, are interested in business cooperation or
              have other questions, please contact us.
            </p>
            <div className={styles.address}>
              <div className={styles.addressL}>
                <h3 className={styles.titleAdd}>Address</h3>
                <p className={styles.contentContact}>
                  10th Floor - The West Tower - 265 Cau Giay - Hanoi
                </p>
              </div>
              <div className={styles.addressR}>
                <h3 className={styles.titleAdd}>Phone Number</h3>
                <p className={styles.contentContact}>+84 911 675 086</p>
              </div>
            </div>
            <h3 className={styles.titleAdd}>Or you can contact us</h3>
            <div className={styles.contactLink}>
              <button className={styles.btnContact}>
                Email Address {<ArrowRight color="white" />}
              </button>
              <button className={styles.btnContact}>
                Via Facebook {<ArrowRight color="white" />}
              </button>
            </div>
          </div>
          <div className={styles.rightCtt}>
            <img src="/01.jpg" alt="t1" className={styles.imgRightCtt} />
          </div>
        </div>
      </div>
    );
}