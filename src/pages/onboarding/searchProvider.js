import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../app/utils/firebaseConfig";
import { useRouter } from "next/router";
import Header from "../../app/components/home/Header";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchProvider = () => {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProviders, setFilteredProviders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      const providersCollectionRef = collection(db, "providers");
      const q = query(providersCollectionRef, orderBy("name"));
      const querySnapshot = await getDocs(q);
      const providersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProviders(providersList);
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    const filtered = providers.filter((provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProviders(filtered);
  }, [searchTerm, providers]);

  const handleSelectProvider = async (provider) => {
    try {
      const providerDocRef = doc(db, "providers", provider.id);
      const providerDocSnap = await getDoc(providerDocRef);

      if (providerDocSnap.exists()) {
        const providerData = providerDocSnap.data();

        if (providerData.status) {
          const docRef = await addDoc(collection(db, "projects"), {
            providerName: provider.name,
            providerID: provider.id,
            createdAt: serverTimestamp(),
            status: "In progress",
          });

          localStorage.setItem("projectID", docRef.id);
          localStorage.setItem("selectedProviderID", provider.id); // Set selectedProviderID here
          router.push("/onboarding/selectCapabilities");
        } else {
          handleRequestNewProvider();
        }
      } else {
        console.error("Provider document not found");
        handleRequestNewProvider();
      }
    } catch (error) {
      console.error("Error fetching provider document: ", error);
    }
  };

  const handleRequestNewProvider = () => {
    router.push("/onboarding/providerRequest");
  };

  return (
    <div className="flex flex-col min-h-screen max-h-fit items-center justify-center text-center text-white font-montserrat bg-slate-900">
      <button
        className="absolute left-4 top-4 text-white"
        onClick={() => router.back()}
      >
        <FontAwesomeIcon icon={faChevronLeft} /> Back
      </button>
      <div className="w-2/3 flex items-center justify-center flex-col">
        <p className="text-3xl">
          Which travel provider do you want to integrate to?
        </p>
        <div className="w-full flex items-center justify-start flex-col relative">
          <input
            type="text"
            placeholder="Search for a provider..."
            className="mt-4 w-full md:w-1/2 px-4 text-gray-700 py-2 rounded focus:outline-none focus:shadow-outline"
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchTerm("")}
          />
          {searchTerm && (
            <div className="absolute top-full text-left mt-1 w-full md:w-1/2 bg-white text-black rounded z-10 max-h-60 overflow-y-auto">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectProvider(provider)}
                >
                  {provider.name}
                </div>
              ))}
              <div
                className="px-4 py-2 cursor-pointer hover:bg-gray-200 underline text-center"
                onClick={handleRequestNewProvider}
              >
                Can&apos;t find it? Send a request.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProvider;
