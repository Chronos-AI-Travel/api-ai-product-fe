import Image from "next/image";
import Slider from "react-infinite-logo-slider";

const LogoSlider = () => {
  return (
    <div className="py-4 bg-gray-200">
      <Slider
        width="150px"
        duration={40}
        pauseOnHover={false}
        blurBorders={true}
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
