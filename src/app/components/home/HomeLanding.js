"use client";
import React, { useState } from "react";
import { ContactUs } from "../modals/ContactUs";
import LogoSlider from "../LogoSlider";
import { useRouter } from "next/navigation";

export const HomeLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const startOnboarding = () => {
    router.push("/onboarding/searchProvider");
  };

  return (
    <div className="flex h-screen flex-col text-center justify-between mt-10 items-center px-10">
      <div className="h-full flex flex-col justify-center items-center">
        <div className="text-teal-300 font-semibold mb-3">
          Integrate with travel APIs, without the complexity.
        </div>
        <div className="text-4xl font-bold mb-3">Chronos Integration Tool</div>
        <div className="text-sm mb-5 font-semibold text-gray-300 px-10 text-center">
          Whether you want to get air content from Skyscanner or flight delay
          information from FlightStats, we integrate their API with your tech
          stack in 24 hours.
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleModal}
            className="standard-button text-teal-300 border-teal-300 border-2"
          >
            Contact us
          </button>
          <button
            onClick={startOnboarding}
            className="standard-button text-black bg-teal-300"
          >
            Add my first API
          </button>
        </div>
      </div>
      <LogoSlider />
      {isModalOpen && <ContactUs onClose={toggleModal} />}{" "}
    </div>
  );
};
