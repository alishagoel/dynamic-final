import React from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import styles from "../styles/navbar.module.css";

export default function Navbar({ user }) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo} onClick={() => router.push("/")}>
        Musicfy
      </h1>

      <ul className={styles.navLinks}>
        <li>
          <button className={styles.navButton} onClick={() => router.push("/")}>
            Home
          </button>
        </li>
        {user && (
          <>
            <li>
              <button
                className={styles.navButton}
                onClick={() => router.push("/profile")}
              >
                Profile
              </button>
            </li>
            <li>
              <button className={styles.navButton} onClick={handleSignOut}>
                Sign Out
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
