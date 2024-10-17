'use client'
import { useRouter } from 'next/navigation';
import styles from './recruitment.module.css'
import { ArrowRight } from '@/components/icon/icon';
const t1 = [
  {
    id: 1,
    name: "Top",
    content:
      "Take on the top lane position in the team, master fighter and tank champions,...",
    img: "/top.jpg",
  },
  {
    id: 2,
    name: "Jungle",
    content:
      "Takes the position of jungler in the team, has the ability to diversify tactics, master jungle monsters,...",
    img: "jgl.jpg",
  },
  {
    id: 3,
    name: "Mid",
    content:
      "Takes the mid lane position in the team, plays mage champions well, has good observation ability on both sides",
    img: "mid.jpg",
  },
  {
    id: 4,
    name: "Adc",
    content:
      "Take on the adc position in the team, proficient in long range champions, good ability to maintain position in combat",
    img: "adc.jpg",
  },
  {
    id: 5,
    name: "Support",
    content:
      "Take on the role of supporting teammates in the team, good map reading ability, knowing how to observe, track, place wards,...",
    img: "sp.jpg",
  },
  {
    id: 6,
    name: "Coach",
    content:
      "Take charge of the team's main strategy, help the team with champion selection, champion banning, etc.",
    img: "coach.jpg",
  },
  {
    id: 7,
    name: "SpCoach",
    content: "Support the main coach in picking and banning champions. Support necessary issues for the players in the team.",
    img: "coach.jpg",
  },
];
export default function Recruitment(){
  const router = useRouter()
    return (
      <div>
        <div className={styles.content1}>
          <h1 className={styles.titleCnt1}>Recruitment</h1>
          <p className={styles.contentCnt1}>
            If you are creative, love challenges and want to spread joy to the
            community through interesting puzzle games, join T1 Esport today!
          </p>
        </div>
        <div className={styles.location}>
          <h1 className={styles.titleLocation}>Find your place</h1>
          <p className={styles.contentLocation}>
            At T1, you will have the opportunity to be trained and develop
            yourself, receive attractive benefits and work in a Class A office
            full of trees and modern amenities.
          </p>
          <div className={styles.bodyLocation}>
            {t1.map((location: any) => (
              <div
                key={location.id}
                className={styles.cardLocation}
                style={{ backgroundImage: `url(${location.img})` }}
              >
                <h2 className={styles.lane}>{location.name}</h2>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.person}>
          <div className={styles.leftPerson}>
            <h1 className={styles.titlePer}>T1 People</h1>
            <p className={styles.contentPer}>
              Coming to Sonat, what you get is not only a quality salary, many
              worthy benefits, a youthful working environment, but also
              talented, enthusiastic and dedicated teammates.
            </p>
            <p className={styles.contentPer}>
              06 factors that make a perfect Sonat-ers:
              <br />- Enthusiastic spirit, always ready to fight
              <br />- Spirit towards innovative and creative thinking
              <br />- Attitude of eagerness to learn, explore and develop
              yourself
              <br />- Harmonious, friendly, progressing and succeeding together
              <br />- Always supporting each other in both work and life
              <br />- Dare to face challenges, always aiming for higher goals
            </p>
            <button
              className={styles.btnRm2}
              onClick={() => router.push("/About")}
            >
              Read more {<ArrowRight color="white" />}
            </button>
          </div>
          <div className={styles.rightPerson}>
            <img src="/personT1.jpg" alt="t1" className={styles.imgPerson} />
          </div>
        </div>
        <div className={styles.culture}>
          <div className={styles.leftCul}>
            <img src="/t1png.png" alt="t1" className={styles.imgCul} />
          </div>
          <div className={styles.rightCul}>
            <h1 className={styles.titleCul}>Culture at T1</h1>
            <p className={styles.contentCul}>1. Teamwork</p>
            <p className={styles.contentCul}>2. Sharing </p>
            <p className={styles.contentCul}>3. Information Exchange</p>
            <p className={styles.contentCul}>4. Unleashing Potential</p>
            <p className={styles.contentCul}>5. Responsibility to the Team</p>
            <p className={styles.contentCul}>6. Professional Attitude</p>
            <button
              className={styles.btnRm1}
              onClick={() => router.push("/About")}
            >
              Read more {<ArrowRight color="white" />}
            </button>
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