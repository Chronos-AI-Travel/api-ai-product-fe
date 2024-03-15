import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../utils/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import OpenRequestsModal from "../modals/OpenRequestsModal";

const OpenRequests = ({ userUid }) => {
  const [providerRequests, setProviderRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProviderRequests = async () => {
      if (!userUid) return;
      const q = query(
        collection(db, "providerRequests"),
        where("createdBy", "==", userUid)
      );
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProviderRequests(requests);
    };

    fetchProviderRequests();
  }, [userUid]);

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    // Assuming OpenRequestsModal is a modal that you can control its visibility
    // You might need to implement a way to show the modal based on `selectedRequest`
  };

  return (
    <div>
      <h2 className="font-semibold my-2 text-white">Open Requests</h2>
      <ul className="flex overflow-x-auto w-full mb-4 p-2 gap-2 rounded-lg">
        {providerRequests.map((request, index) => (
          <li
            key={index}
            className="text-slate-900 justify-between cursor-pointer gap-1 w-40 bg-slate-300 border rounded-lg p-2 flex flex-col hover:scale-105 transition-transform duration-200"
            onClick={() => handleRequestClick(request)}
          >
            <span className="text-lg font-semibold">{request.apiIntegration}</span>
            <div className="text-right">
              <span className="text-xs font-light">
                {request.createdAt?.toDate().toLocaleDateString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {selectedRequest && (
        <OpenRequestsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default OpenRequests;
