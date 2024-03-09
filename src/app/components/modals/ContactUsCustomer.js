import React, { useState } from "react"; // Make sure to import useState

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";

export const ContactUsCustomer = ({ onClose }) => {
  const [showSuccess, setShowSuccess] = useState(false); // State to control success icon visibility

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      firstName: formData.get("firstName"),
      surname: formData.get("surname"),
      email: formData.get("email"),
      companyName: formData.get("companyName"),
      website: formData.get("website"),
      message: formData.get("message"),
      apis: formData.get("apis")
    };

    try {
      const response = await fetch("http://localhost:5000/contact_us_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowSuccess(true); // Show success icon
        setTimeout(() => {
          setShowSuccess(false); // Hide success icon
          onClose(); // Close modal
        }, 1000); // Wait for 1 second
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="modalBackground text-black">
      <div className="modalContainer w-2/3 md:w-1/2 lg:w-1/2">
        <div className="py-2 flex justify-between flex-row">
          <p className="text-3xl">Contact Us</p>
          <FontAwesomeIcon
            className="text-black cursor-pointer"
            onClick={onClose}
            icon={faTimes}
          />
        </div>
        {showSuccess ? (
          <div className="flex justify-center items-center h-full">
            <FontAwesomeIcon
              icon={faCheck}
              className="text-green-500 text-3xl"
            />
          </div>
        ) : (
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <input
              name="firstName"
              placeholder="First name"
              className="border rounded-lg p-2"
            />
            <input
              name="surname"
              placeholder="Surname"
              className=" border rounded-lg p-2"
            />
            <input
              name="email"
              placeholder="Email address"
              className=" border rounded-lg p-2"
            />
            <input
              placeholder="Company name"
              name="companyName"
              className=" border rounded-lg p-2"
            />
            <input
              name="firstName"
              placeholder="Website"
              className=" border rounded-lg p-2"
            />
            <textarea
              placeholder="Any other information"
              className="border rounded-lg p-2"
              name="message"
              rows="4"
            ></textarea>
            <textarea
              placeholder="List of API(s) you are wanting to integrate to"
              className="border rounded-lg p-2"
              name="apis"
              rows="4"
            ></textarea>
            <button className="standard-button bg-black self-end text-white w-fit">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
