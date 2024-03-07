import "/src/app/globals.css";
import { HomeSection1 } from "./components/home/HomeSection1";
import { HomeSection2 } from "./components/home/HomeSection2";
import { Footer } from "./components/home/Footer";
import { Header } from "./components/home/Header";
import { HomeSection3 } from "./components/home/HomeSection3";

export default function Home() {
  return (
    <div className="flex flex-col text-white font-montserrat bg-slate-900">
      <Header />
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
        <div className="text-sm mb-5 font-semibold  text-gray-300 w-1/3 text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum
          dolor sit amet, consectetur adipiscing elit,
        </div>

        <button className="standard-button text-black bg-teal-300">
          Call to Action{" "}
        </button>
      </div>
      <HomeSection1 />
      <HomeSection2 />
      <HomeSection3 />
      <Footer />
    </div>
  );
}
