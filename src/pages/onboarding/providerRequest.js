import { useState } from "react";
import { useRouter } from "next/router";
import FormSubmittedModal from "../../app/components/modals/FormSubmittedModal";

const ProviderRequest = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center text-white font-montserrat bg-slate-900">
      <div className="h-screen w-2/3 flex items-center justify-center flex-col">
        <p className="text-3xl">Request a new provider</p>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col m-4">
          <input
            type="text"
            placeholder="Full name"
            required
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <input
            type="text"
            placeholder="Your Company name"
            required
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <input
            type="url"
            placeholder="Your Company URL"
            required
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <input
            type="email"
            placeholder="Your work email"
            required
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <input
            type="text"
            placeholder="Which API do you want to integrate to?"
            required
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <textarea
            placeholder="Requirements"
            required
            className="textarea-field text-slate-900 rounded-lg p-2"
          ></textarea>
          <input
            type="url"
            placeholder="URL link to API documentation"
            className="input-field p-2 text-slate-900 rounded-lg"
          />
          <button type="submit" className="submit-button bg-teal-300 standard-button text-slate-800">
            Submit and setup a review session
          </button>
        </form>
        {showModal && 
        <FormSubmittedModal setShowModal={setShowModal} />
}
      </div>
    </div>
  );
};

export default ProviderRequest;
