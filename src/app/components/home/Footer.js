import Image from "next/image";

export const Footer = () => {
  return (
    <div className="py-20 py-4 flex flex-row justify-between items-center text-slate-800 bg-white shadow-xl shadow-black px-8">
      <div className="flex items-center">
        <Image src={"/Logo.webp"} height={50} width={50} alt="logo" />
        <p className="text-2xl font-bold text-gray-800">Chronos</p>
      </div>
      <p className="text-xs text-right">© 2024 Chronos. All rights reserved.</p>
    </div>
  );
};
