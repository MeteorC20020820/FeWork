import styles from './about.module.css'
import { ArrowRight } from '@/components/icon/icon';
const imgT1 = [
  {
    id: 1,
    img: "/ct1.jpg",
  },
  {
    id: 2,
    img: "/ct2.jpg",
  },
  {
    id: 3,
    img: "/ct3.jpg",
  },
  {
    id: 4,
    img: "/ct4.jpg",
  },
  {
    id: 5,
    img: "/ct5.jpg",
  },
];
export default function About(){
    return (
      <div className={styles.about}>
        <div className={styles.about1}>
          <div className={styles.leftAbout}>
            <h1 className={styles.titleLeft}>Office & Working Conditions</h1>
            <p className={styles.textLeft}>
              The office is not only a working space but also a source of ideas
              for each individual. Therefore, improving working conditions,
              aiming to build a "modern, friendly, quality" office is the top
              desire of the T1 Game Studio leadership team.
            </p>
          </div>
        </div>
        <div className={styles.slogan}>
          <p className={styles.textSlogan}>
            T1 wants to build a great working environment, where every employee
            always feels comfortable like at home.
          </p>
        </div>
        <div className={styles.content1}>
          <h1 className={styles.titleCnt1}>
            The passion of the Leadership Team
          </h1>
          <p className={styles.contentCnt1}>
            The new office on the 11th floor of Bamboo Airways Tower is the
            result of months of dedication from CEO T1 - Joe Marsh. From the
            design, construction to the selection of furniture and landscape,
            everything has been meticulously and carefully crafted. This is not
            only a milestone to commemorate Sonat's success in the past, but
            also an affirmation towards the future with even higher goals.
          </p>
          <div className={styles.bodyImgCnt1}>
            <img src="/logot12.jpg" alt="t1" className={styles.imgCnt1} />
          </div>
          <p className={styles.contentCnt1}>
            With the current good working conditions, T1Team will have more
            motivation and inspiration to work, contribute, and conquer the goal
            of "TOP 1 Esport Games" Global in the future.
          </p>
        </div>
        <div className={styles.content2}>
          <h1 className={styles.titleCnt1}>Modern and comfortable office</h1>
          <p className={styles.contentCnt1}>
            5 elements that make up a modern office with T1 style:
            <br />- Class A office in the most modern building in Korea
            <br />- Green space, airy, full of natural light
            <br />- Expensive view, panoramic view of the city Fully equipped,
            modern and convenient
            <br />- Open space, creative decoration, inspiring work
          </p>
          <div className={styles.bodyImgCnt1}>
            {imgT1.map((imgt1) => (
              <img
                key={imgt1.id}
                src={`${imgt1.img}`}
                alt="t1"
                className={styles.imgCnt}
              />
            ))}
          </div>
        </div>
        <div className={styles.search}>
          <h1 className={styles.titleSrch}>Looking for Opportunities</h1>
          <p className={styles.contentSrch}>
            Find creative opportunities with Sonat Game Studio
          </p>
          <button className={styles.btnSrch}>Join us</button>
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