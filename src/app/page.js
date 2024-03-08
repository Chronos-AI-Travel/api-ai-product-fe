import "/src/app/globals.css";
import { HomeSection1 } from "./components/home/HomeSection1";
import { HomeSection2 } from "./components/home/HomeSection2";
import { Footer } from "./components/home/Footer";
import { Header } from "./components/home/Header";
import { HomeSection3 } from "./components/home/HomeSection3";
import { HomeLanding } from "./components/home/HomeLanding";

export default function Home() {
  return (
    <div className="flex flex-col text-center text-white font-montserrat bg-slate-900">
      <Header />
      <HomeLanding />
      <HomeSection1 />
      <HomeSection2 />
      <HomeSection3 />
      <Footer />
    </div>
  );
}
