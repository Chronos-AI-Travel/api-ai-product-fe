"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleAdminAccess = () => {
    // Step 2: Function to check password and navigate
    const password = prompt("Please enter the password to continue:");
    if (password === "1Time4UrM") {
      router.push("/signUp"); // Step 3: Navigate if password is correct
    } else {
      alert("Incorrect password.");
    }
  };

  return (
    <div className="h-16 py-10 flex flex-row text-sm justify-between items-center px-4">
      <Image src={"/Logo.webp"} height={50} width={50} alt="logo" />
      <div className="md:flex hidden gap-8">
        <div className="flex gap-8 items-left">
          {/* <button>Products</button>
          <button>Use Cases</button>
          <button>About</button> */}
        </div>
        <button
          onClick={handleAdminAccess}
          className="standard-button bg-white text-black cursor-hover"
        >
          Admin Access
        </button>
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
          <button>Products</button>
          <button>Use Cases</button>
          <button>About</button>
          <button
            onClick={handleAdminAccess}
            className="standard-button bg-white text-black cursor-hover"
          >
            Admin Access
          </button>
        </div>
      )}
    </div>
  );
};
