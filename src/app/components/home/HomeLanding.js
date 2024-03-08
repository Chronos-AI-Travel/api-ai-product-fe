export const HomeLanding = () => {
  return (
    <div className="h-screen flex flex-col text-center justify-between mt-10 items-center px-10">
      <div className="h-screen flex flex-col justify-center items-center -mt-32">
        <div className="text-teal-300 font-semibold  mb-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </div>
        <div className="text-4xl font-bold mb-3">
          Lorem ipsum dolor sit amet.
        </div>
        <div className="text-2xl font-semibold  mb-1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </div>
        <div className="text-sm mb-5 font-semibold  text-gray-300 px-10 text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum
          dolor sit amet, consectetur adipiscing elit,
        </div>

        <button className="standard-button text-black bg-teal-300">
          Call to Action
        </button>
      </div>
    </div>
  );
};
