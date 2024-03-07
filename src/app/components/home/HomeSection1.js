export const HomeSection1 = () => {
  return (
    <div className="h-screen flex flex-col text-center justify-between mt-10 items-center">
      <div>
        <div className="text-sm fontlight text-gray-300">
          Section 1 Subtitle
        </div>
        <div className="text-3xl fontlight text-white">Section 1 Title</div>
      </div>
      <div className="bg-white text-black rounded-2xl flex items-center justify-center w-10/12 h-full m-20">
        Section 1 Content
      </div>
      <div></div>
    </div>
  );
};
