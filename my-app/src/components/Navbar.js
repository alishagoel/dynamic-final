import React from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

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
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="logo" onClick={() => router.push("/")}>
          Musicfy
        </h1>
        <ul className="nav-links">
          <li>
            <button className="nav-button" onClick={() => router.push("/")}>
              Home
            </button>
          </li>
          {user && (
            <>
              <li>
                <button
                  className="nav-button"
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </button>
              </li>
              <li>
                <button className="nav-button" onClick={handleSignOut}>
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
