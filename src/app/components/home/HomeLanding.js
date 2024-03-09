"use client";
import React, { useState } from "react";
import { ContactUs } from "../modals/ContactUs";

export const HomeLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className=" flex flex-col text-center justify-between mt-10 items-center px-10">
      <div className="h-screen flex flex-col justify-center items-center -mt-32">
        <div className="text-teal-300 font-semibold mb-3">
          Integrate with travel APIs, without the complexity.
        </div>
        <div className="text-4xl font-bold mb-3">Chronos Integration Tool</div>
        <div className="text-sm mb-5 font-semibold text-gray-300 px-10 text-center">
          Whether you want to get air content from Skyscanner or flight delay
          information from FlightStats, we integrate their API with your tech
          stack in 24 hours.
        </div>
        <button
          onClick={toggleModal}
          className="standard-button text-black bg-teal-300"
        >
          Contact us
        </button>
      </div>
      {isModalOpen && <ContactUs onClose={toggleModal} />}{" "}
    </div>
  );
};
