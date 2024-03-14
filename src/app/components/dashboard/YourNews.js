import { useRouter } from "next/router"; // Import useRouter

const YourNews = () => {
  return (
    <div>
      <h2 className="font-semibold my-2 text-white">News</h2>
      <ul className="flex overflow-x-auto w-full mb-4 p-2 gap-4 rounded-lg">
      <li
          className="text-slate-900 justify-between cursor-pointer gap-1 w-40 bg-white border rounded-lg p-2 flex flex-col"
        >
          <span className="font-semibold">News Item 1</span>
          <div className="text-left text-xs">
          News copy news copy
            News copy news copy
            News copy news copy
          </div>
        </li><li
          className="text-slate-900 justify-between cursor-pointer gap-1 w-40 bg-white border rounded-lg p-2 flex flex-col"
        >
          <span className="font-semibold">News Item 2</span>
          <div className="text-left text-xs">
          News copy news copy
            News copy news copy
            News copy news copy
          </div>
        </li><li
          className="text-slate-900 justify-between cursor-pointer gap-1 w-40 bg-white border rounded-lg p-2 flex flex-col"
        >
          <span className="font-semibold">News Item 3</span>
          <div className="text-left text-xs">
          News copy news copy
            News copy news copy
            News copy news copy
          </div>
        </li>
      </ul>
    </div>
  );
};

export default YourNews;
