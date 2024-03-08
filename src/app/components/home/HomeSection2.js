export const HomeSection2 = () => {
  return (
    <div className="h-screen bg-white py-20 px-10 flex flex-col text-center justify-between  items-center">
      <div>
        <div className="text-sm fontlight text-center text-gray-700">
          Section 2 Subtitle
        </div>
        <div className="text-3xl mb-20 fontlight text-gray-900">
          Section 2 Title
        </div>
      </div>
      <div className="flex items-center flex-col md:flex-row lg:flex-row w-full h-full">
        <div className="bg-slate-600 text-white rounded-2xl flex items-center justify-center w-full h-full m-4">
          Section Content
        </div>
        <div className="bg-slate-600 text-white rounded-2xl flex items-center justify-center w-full h-full m-4">
          Section Content
        </div>
      </div>
      <div></div>
    </div>
  );
};
