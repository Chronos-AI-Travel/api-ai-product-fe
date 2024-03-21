import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FormSubmittedModal from "../../app/components/modals/FormSubmittedModal";
import { InlineWidget } from "react-calendly";
import { db, auth } from "../../app/utils/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProviderRequest = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [userUid, setUserUid] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      fullName: formData.get("fullName"),
      companyName: formData.get("companyName"),
      companyURL: formData.get("companyURL"),
      workEmail: formData.get("workEmail"),
      apiIntegration: formData.get("apiIntegration"),
      requirements: formData.get("requirements"),
      apiDocumentationURL: formData.get("apiDocumentationURL"),
      createdBy: userUid, // Use the state value directly
      createdAt: serverTimestamp(),
    };

    try {
      const response = await fetch(
        "https://api-ai-product-be.onrender.com/provider_request_email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        await addDoc(collection(db, "providerRequests"), data);
        setShowCalendlyModal(true);
      } else {
        console.error("Failed to send provider request email");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onCalendlyEventScheduled = () => {
    setShowCalendlyModal(false);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center py-10 justify-center text-center text-white font-montserrat bg-slate-900">
      <button
        className="absolute left-4 top-4 text-white"
        onClick={() => router.back()}
      >
        <FontAwesomeIcon icon={faChevronLeft} /> Back
      </button>
      <div className="min-h-screen h-full w-full flex items-center justify-center flex-col">
        <p className="text-3xl">Request a new provider</p>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col m-4">
          <input
            type="text"
            placeholder="Full name"
            required
            name="fullName"
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <input
            type="text"
            placeholder="Your Company name"
            required
            name="companyName"
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <input
            type="url"
            placeholder="Your Company URL"
            required
            name="companyURL"
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <input
            type="email"
            placeholder="Your work email"
            required
            name="workEmail"
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <input
            type="text"
            placeholder="Which API do you want to integrate to?"
            required
            name="apiIntegration"
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <textarea
            placeholder="Requirements"
            required
            name="requirements"
            className="textarea-field text-slate-900 rounded-lg p-2"
          ></textarea>
          <input
            type="url"
            placeholder="URL link to API documentation"
            name="apiDocumentationURL"
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <button
            type="submit"
            className="submit-button bg-teal-300 standard-button text-slate-800"
          >
            Submit and setup a review session
          </button>
        </form>
        {showModal && <FormSubmittedModal setShowModal={setShowModal} />}
        {showCalendlyModal && (
        <div
          className="calendly-modal h-full my-4"
          style={{
            position: "fixed", // Use fixed positioning to make it float above the content
            top: "50%", // Center vertically
            left: "50%", // Center horizontally
            transform: "translate(-50%, -50%)", // Adjust the transform to ensure it's centered
            width: "100%", // Set the width to 80% of the viewport width
            maxWidth: "600px", // Max width for larger screens
            zIndex: 1000, // Ensure it's above other content
            backgroundColor: "white", // Background color for the modal
            padding: "20px", // Add some padding inside the modal
            borderRadius: "8px", // Optional: rounded corners
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <InlineWidget
            url="https://calendly.com/joshsparkes6/provider-request-meeting"
            onEventScheduled={onCalendlyEventScheduled}
            styles={{ height: "90%" }} // Adjust the height of the Calendly widget
          />
          <button
            onClick={() => {
              setShowCalendlyModal(false);
              setShowModal(true); // Open the FormSubmittedModal right after closing the Calendly modal
            }}
            style={{
              position: "relative", // Position the button absolutely within the modal
              top: "10px", // Distance from the top of the modal
              right: "10px", // Distance from the right of the modal
            }}
            className="text-black border-2 border-black p-2 rounded-lg"
          >
            Close
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default ProviderRequest;
