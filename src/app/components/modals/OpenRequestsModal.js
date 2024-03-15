import { useRouter } from 'next/router';

const OpenRequestsModal = ({ request, onClose }) => {
  const router = useRouter();

  return (
    <div className="modalBackground text-black">
      <div className="modalContainer w-3/4 md:w-1/2 lg:w-1/2 flex flex-col gap-4">
        <p className='text-3xl'>Request Details</p>
        <p>Company Name: {request.companyName}</p>
        <p>API Integration: {request.apiIntegration}</p>
        <p>Requirements: {request.requirements}</p>
        <p>API Docs URL: {request.apiDocumentationURL}</p>
        <p>Company URL: {request.companyURL}</p>
        <p>Full Name: {request.fullName}</p>
        <p>Email: {request.workEmail}</p>
        <p>Created At: {request.createdAt?.toDate().toLocaleDateString()}</p>
        <button className='standard-button' onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default OpenRequestsModal;