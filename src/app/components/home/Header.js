
export const Header = () => {
  return (
    <div className="h-16 py-4 flex flex-row text-sm justify-between items-center px-8">
      <div>Logo</div>
      <div className="flex flex-row gap-8">
        <div className="flex gap-8 items-left">
          <button>Products</button>
          <button>Use Cases</button>
          <button>About</button>
        </div>
        <button className="standard-button bg-white text-black">
          Get Started
        </button>
      </div>
    </div>
  );
};
