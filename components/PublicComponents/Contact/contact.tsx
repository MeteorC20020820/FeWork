'use client'
import { useRouter } from 'next/navigation';
import styles from './contact.module.css'
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Contact(){
    const router = useRouter()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState("")
    
    const changeFullName = (e:any) =>{
      setFullName(e.target.value)
    }
    const changeEmail = (e:any) => {
      setEmail(e.target.value)
    }
    const changePhone = (e:any) =>{
      setPhone(e.target.value)
    }
    const changeMess = (e:any) =>{
      setMessage(e.target.value)
    }

    const [sendInfo, setSendInfo] = useState({})

    useEffect(() =>{
      setSendInfo({

      })
    },[fullName, email, phone, message])
    const sendAPIForm = async() =>{
      try{
        const res = await axios.post(``,sendInfo )
      }
      catch(error){
        console.log(error)
      }
    }

    return (
      <div className={styles.contact}>
        <div className={styles.contact1}>
          <h1 className={styles.titleCtt1}>Contact</h1>
        </div>
        <div className={styles.contact2}>
          <div className={styles.leftCtt2}>
            <p className={styles.contentCtt2L}>Phone Number</p>
            <p className={styles.contentCtt2L}>Email</p>
            <p className={styles.contentCtt2L}>Address</p>
            <p className={styles.contentCtt2L}>Work Time</p>
          </div>
          <div className={styles.rightCtt2}>
            <p className={styles.contentCtt2R}>+0123456789</p>
            <p className={styles.contentCtt2R}>T1Esport@t1.vn</p>
            <p className={styles.contentCtt2R}>
              10th Floor - The West Tower - 265 Cau Giay - Hanoi
            </p>
            <p className={styles.contentCtt2R}>8:30 - 18:00 Monday to Friday</p>
          </div>
        </div>
        <div className={styles.contactForm}>
          <div className={styles.leftForm}>
            <h1 className={styles.titleForm}>Contact</h1>
            <div className={styles.form}>
              <input
                className={styles.inputForm}
                type="text"
                placeholder="Full name..."
                value={fullName}
                onChange={changeFullName}
              />
              <input
                className={styles.inputForm}
                type="text"
                placeholder="Email address..."
                value={email}
                onChange={changeEmail}
              />
              <input
                className={styles.inputForm}
                type="text"
                placeholder="Phone number (*)"
                value={phone}
                onChange={changePhone}
              />
              <textarea
                name=""
                id=""
                placeholder="Message..."
                className={styles.inputForm}
                rows={5}
                cols={100}
                value={message}
                onChange={changeMess}
              ></textarea>
              <button className={styles.btnForm}>Send</button>
            </div>
          </div>
          <div className={styles.rightForm}>
            <img src="/faker.jpg" alt="" className={styles.imgForm} />
          </div>
        </div>
        <div className={styles.contact3}>
          <h1 className={styles.titleCtt3}>Looking for Opportunities</h1>
          <p className={styles.contentCtt3}>
            Looking for an opportunity to join T1 Esport
          </p>
          <button className={styles.btnCtt3} onClick={() => router.push("/Recruitment")}>Join Us</button>
        </div>
      </div>
    );
}