import React, { useState } from "react";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseConfig";

const Navbar2 = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      router.push("/signUp");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const isDashboard = router.pathname === "/dashboard";

  return (
    <div className="h-16 py-10 flex flex-row text-sm justify-between items-center px-4">
      <Image src={"/Logo.webp"} height={50} width={50} alt="logo" />
      <div className="md:flex hidden flex-row items-center gap-8 ">
        <div className="flex flex-row gap-8 items-center ">
          <button className={`${isDashboard ? "font-bold" : ""}`}>
            Dashboard
          </button>
          <button>Page 2</button>
          <button>Page 3</button>
          <button className="" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
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
          <button className={`${isDashboard ? "font-bold" : ""}`}>
            Dashboard
          </button>
          <button>Page 2</button>
          <button>Page 3</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default Navbar2;
