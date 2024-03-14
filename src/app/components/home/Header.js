"use client";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // const handleAdminAccess = () => {
  //   const password = prompt("Please enter the password to continue:");
  //   if (password === "1Time4UrM") {
  //     router.push("/signUp"); // Step 3: Navigate if password is correct
  //   } else {
  //     alert("Incorrect password.");
  //   }
  // };

  const handleSignIn = () => {
    router.push("/signUp");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="h-16 py-10 flex flex-row text-sm justify-between items-center px-4">
      <Image
        src={"/Logo.webp"}
        height={50}
        width={50}
        alt="logo"
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
      />{" "}
      <div className="md:flex hidden gap-4">
        <div className="flex gap-4 items-left">
          {/* <button>Products</button>
          <button>Use Cases</button>
          <button>About</button> */}
        </div>
        {!isSignedIn ? (
          <button
            onClick={handleSignIn}
            className="standard-button bg-white text-black cursor-hover"
          >
            Sign In
          </button>
        ) : (
          <button
            onClick={handleDashboard}
            className="standard-button bg-white text-black cursor-hover"
          >
            Dashboard
          </button>
        )}
        {/* <button
          onClick={handleAdminAccess}
          className="standard-button border text-white cursor-hover"
        >
          Admin Access
        </button> */}
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={toggleDrawer}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      {isDrawerOpen && (
        <div className="absolute inset-y-0 right-0 bg-slate-900 text-white px-8 py-6 shadow-lg z-50 flex flex-col items-end gap-5 w-2/3 h-screen shadow-lg shadow-black">
          <div className="md:hidden flex items-center">
            <button onClick={toggleDrawer}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <Image src={"/Logo.webp"} height={50} width={50} alt="logo" />
          {/* <button>Products</button>
          <button>Use Cases</button>
          <button>About</button> */}
          {!isSignedIn ? (
            <button
              onClick={handleSignIn}
              className="standard-button bg-white text-black cursor-hover"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={handleDashboard}
              className="standard-button bg-white text-black cursor-hover"
            >
              Dashboard
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
