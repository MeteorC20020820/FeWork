'use client'
import styles from './login.module.css'
import { ArrowCirleLeft } from '../icon/icon';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Login(){
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const sendEmail = (e:any)=>{
      setEmail(e.target.value)
    }
    const sendPassword = (e:any) => {
      setPassword(e.target.value)
    }
    const [sendInfo, setSendInfo] = useState({})

    useEffect(() =>{
      setSendInfo({

      })
    },[email, password])
    const ApiSendForm = async() =>{
      try{
        const res = await axios.post(``, sendInfo)
      }
      catch(error){
        console.log(error)
      }
    }
    return (
      <div className={styles.login}>
        <button
          className={styles.backHome}
          onClick={() => router.push("/Home")}
        >
          {<ArrowCirleLeft width="25px" height="25px" color="black" />}Back Home
        </button>
        <div className={styles.bodyLogin}>
          <div className={styles.leftLogin}>
            <img src="/t1login.jpg" alt="t1" className={styles.imgLogin} />
          </div>
          <div className={styles.rightLogin}>
            <h1 className={styles.titleLogin1}>Hello!</h1>
            <h1 className={styles.titleLogin2}>Welcome to T1 Esport</h1>
            <div className={styles.formLogin}>
              <h2 className={styles.titleForm}>Login your account</h2>
              <input
                type="text"
                className={styles.inputForm}
                placeholder="Email..."
                value={email}
                onChange={sendEmail}
              />
              <input
                type="password"
                className={styles.inputForm}
                placeholder="Password..."
                value={password}
                onChange={sendPassword}
              />
              <p className={styles.forgetPw}>forget password?</p>
              <button className={styles.btnLogin}>Login</button>
            </div>
          </div>
        </div>
      </div>
    );
}