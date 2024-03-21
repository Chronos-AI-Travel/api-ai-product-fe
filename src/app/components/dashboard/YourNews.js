import { useRouter } from "next/router"; // Import useRouter

const YourNews = () => {
  return (
    <div>
      <h2 className="font-semibold my-2 text-white">News</h2>
      <ul className="flex overflow-x-auto w-full mb-4 p-2 gap-4 rounded-lg">
        <li className="text-slate-900 justify-between cursor-pointer gap-1 w-40 bg-white border rounded-lg p-2 flex flex-col">
          <span className="font-semibold">New API</span>
          <div className="text-left text-xs">
            Duffel Stays has been added to the Chronos portfolio!
          </div>
        </li>
        <li className="text-slate-900 justify-between cursor-pointer gap-1 w-40 bg-white border rounded-lg p-2 flex flex-col">
          <span className="font-semibold">New API</span>
          <div className="text-left text-xs">
            Duffel Flights has been added to the Chronos portfolio!
          </div>
        </li>
        <li className="text-slate-900 justify-between cursor-pointer gap-1 w-40 bg-white border rounded-lg p-2 flex flex-col">
          <span className="font-semibold">Upcoming API</span>
          <div className="text-left text-xs">BA NDC is on its way!</div>
        </li>
      </ul>
    </div>
  );
};

export default YourNews;
