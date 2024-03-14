import { useState } from "react";
import { useRouter } from "next/router";
import FormSubmittedModal from "../../app/components/modals/FormSubmittedModal";

const ProviderRequest = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      fullName: formData.get("fullName"), // Assuming the name attribute of your input field is "fullName"
      companyName: formData.get("companyName"), // Adjust the name attribute as per your form
      companyURL: formData.get("companyURL"), // Adjust the name attribute as per your form
      workEmail: formData.get("workEmail"), // Adjust the name attribute as per your form
      apiIntegration: formData.get("apiIntegration"), // Adjust the name attribute as per your form
      requirements: formData.get("requirements"), // Adjust the name attribute as per your form
      apiDocumentationURL: formData.get("apiDocumentationURL"), // Adjust the name attribute as per your form
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
        setShowModal(true); // Show the modal upon successful email sending
      } else {
        console.error("Failed to send provider request email");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center text-white font-montserrat bg-slate-900">
      <div className="h-screen w-full flex items-center justify-center flex-col">
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
      </div>
    </div>
  );
};

export default ProviderRequest;
