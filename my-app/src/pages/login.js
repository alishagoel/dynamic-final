import { useState } from "react";
import { useRouter } from "next/router";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, firestore } from "../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import styles from "../styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password.length < 6) {
          setErrorMessage("Password must be at least 6 characters.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: displayName,
        });

        await setDoc(doc(firestore, "users", user.uid), {
          displayName: displayName,
          email: user.email,
        });
      }

      router.push("/");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password. Please try again.");
      } else if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email already exists. Please use a different email.");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.musicfyLogo}>Musicfy</div>
        <h1 className={styles.title}>{isLogin ? "Login" : "Sign Up"}</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              className={styles.input}
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          )}
          <button className={styles.submitButton} type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <button
          className={styles.toggleButton}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create an account" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
