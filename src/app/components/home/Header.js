"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="h-16 py-10 flex flex-row text-sm justify-between items-center px-8">
      <Image src={"/Logo.webp"} height={50} width={50} alt="logo" />
      <div className="md:flex hidden gap-8">
        <div className="flex gap-8 items-left">
          {/* <button>Products</button>
          <button>Use Cases</button>
          <button>About</button> */}
        </div>
        {/* <button className="standard-button bg-white text-black">
          Contact us
        </button> */}
      </div>
      {/* <div className="md:hidden flex items-center">
        <button onClick={toggleDrawer}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div> */}
      {isDrawerOpen && (
        <div className="absolute inset-y-0 right-0 bg-slate-900 text-white px-8 py-6 shadow-lg z-50 flex flex-col items-end gap-5 w-2/3 h-screen shadow-lg shadow-black">
          <div className="md:hidden flex items-center">
            <button onClick={toggleDrawer}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div>Logo</div>
          <button>Products</button>
          <button>Use Cases</button>
          <button>About</button>
          <button className="standard-button bg-white text-black">
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};
