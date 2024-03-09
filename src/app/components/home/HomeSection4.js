"use client";
import { useState } from "react";
import { ContactUs } from "../modals/ContactUs";
import { ContactUsCustomer } from "../modals/ContactUsCustomer";

export const HomeSection4 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const toggleCustomerModal = () => {
    setIsCustomerModalOpen(!isCustomerModalOpen);
  };
  return (
    <div className="h-screen bg-white py-20 px-10 flex flex-col text-center justify-between  items-center">
      <div>
        <div className="text-sm fontlight text-gray-400 uppercase">
          Interested?
        </div>
        <div className="text-4xl mb-20 fontlight text-gray-900">
          Get in touch
        </div>
      </div>
      <div className="flex items-center flex-col md:flex-row lg:flex-row w-full h-full">
        <div className="bg-gray-300 flex p-8 gap-4 rounded-2xl flex flex-col items-start justify-start text-left w-full h-full m-4">
          <p className="uppercase text-gray-500 text-xs">API Customers </p>
          <p className="text-black text-xl">
            Are you currently looking to integrate with ANY travel related API,
            but are struggling with travel expertise, time or resource
            constraints?
          </p>
          <button
            onClick={toggleModal}
            className="standard-button text-white bg-black"
          >
            Contact us
          </button>
        </div>
        <div className="bg-blue-500 flex p-8 gap-4 rounded-2xl flex flex-col items-start justify-start text-left w-full h-full m-4">
          <p className="uppercase text-gray-200 text-xs">API providers </p>
          <p className="text-white text-xl">
            Are you a Travel API provider looking to get customers onboarded to
            your API faster?
            <br />
            <br />
          </p>
          <button
            onClick={toggleCustomerModal}
            className="standard-button text-white bg-black"
          >
            Contact us
          </button>
        </div>
      </div>
      <div></div>
      {isModalOpen && <ContactUs onClose={toggleModal} />}
      {isCustomerModalOpen && (
        <ContactUsCustomer onClose={toggleCustomerModal} />
      )}
    </div>
  );
};
