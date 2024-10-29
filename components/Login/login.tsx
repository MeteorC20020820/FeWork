'use client'
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
  const sendEmail = (e:any) => {
    setEmail(e.target.value);
  };
  const sendPassword = (e:any) => {
    setPassword(e.target.value);
  };

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
      const userRole =
        decodedPayload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

       router.push("/Employee/Info");
    } catch (error:any) {
      console.log(error);
      setError(error.response.data.message)
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.blogin}>
        <button
          className={styles.backHome}
          onClick={() => router.push("/Home")}
        >
          <ArrowCirleLeft width="25px" height="25px" color="black" />
          Back Home
        </button>
        <div className={styles.bodyLogin}>
          <div className={styles.leftLogin}>
            <div className={styles.bodyLogo}>
              <img src="/t1login.jpg" alt="t1" className={styles.imgLogin} />
            </div>
          </div>
          <div className={styles.rightLogin}>
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
              {error && <p className={styles.error}>{error}</p>}{" "}
              {/* Display error message */}
              <p className={styles.forgetPw}>Forget password?</p>
              <button className={styles.btnLogin} onClick={ApiSendForm}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
