"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./login.module.css";
import { ArrowCirleLeft } from "../icon/icon";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const sendEmail = (e:any) => setEmail(e.target.value);
  const sendPassword = (e:any) => setPassword(e.target.value);

  const ApiSendForm = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");

    try {
      const res = await axios.post(`http://localhost:7295/api/Account/Login`, {
        email,
        password,
      });
      const token = res.data.data;
      localStorage.setItem("authToken", token);

      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      console.log(decodedPayload);

      router.push("/Employee/Info");
    } catch (error) {
      console.log(error);
      setError("An error occurred.");
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.bodyLogo}>
        
      </div>
      <div className={styles.blogin}>
        <button
          className={styles.backHome}
          onClick={() => router.push("/Home")}
        >
          <ArrowCirleLeft width="25px" height="25px" color="white" />
          Back Home
        </button>
        <h1 className={styles.titleLogin2}>Login</h1>
        <div className={styles.formLogin}>
          <input
            type="text"
            className={styles.inputForm}
            placeholder="Username"
            value={email}
            onChange={sendEmail}
          />
          <input
            type="password"
            className={styles.inputForm}
            placeholder="Password"
            value={password}
            onChange={sendPassword}
          />
          
          {error && <p className={styles.error}>{error}</p>}
          <p className={styles.forgetPw}>Forgot password?</p>
          <button className={styles.btnLogin} onClick={ApiSendForm}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
