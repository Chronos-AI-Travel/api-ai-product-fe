import Image from "next/image";
import Slider from "react-infinite-logo-slider";

const LogoSlider = () => {
  return (
    <div className="py-4 bg-gray-200 w-screen">
      <Slider
        width="150px" // Changed from a fixed width to a percentage
        duration={40}
        pauseOnHover={false}
        blurBorders={false}
        blurBoderColor={"#fff"}
      >
        <Slider.Slide>
          <Image src={"/Uber.webp"} width={100} height={100} alt="uber" />
        </Slider.Slide>
        <Slider.Slide>
          <Image src={"/SkyScanner.webp"} width={100} height={100} alt="uber" />{" "}
        </Slider.Slide>
        <Slider.Slide>
          <Image src={"/Booking.webp"} width={100} height={100} alt="uber" />{" "}
        </Slider.Slide>
        <Slider.Slide>
          <Image
            src={"/TripAdvisor.webp"}
            width={100}
            height={100}
            alt="uber"
          />
        </Slider.Slide>
        <Slider.Slide>
          <Image src={"/Maps.webp"} width={100} height={100} alt="uber" />
        </Slider.Slide>
      </Slider>
    </div>
  );
};

export default LogoSlider;
