import Image from "next/image";
import Slider from "react-infinite-logo-slider";

const LogoSlider = () => {
  return (
    <div className="py-4 bg-gray-200 w-screen">
      <Slider
        width="150px" // Assuming you want to keep this as a fixed width for the slider itself
        duration={40}
        pauseOnHover={false}
        blurBorders={false}
        blurBoderColor={"#fff"}
      >
        <Slider.Slide>
          <div style={{ width: 100, height: 100, position: "relative" }}>
            <Image src={"/Uber.webp"} fill objectFit="contain" alt="uber" />
          </div>
        </Slider.Slide>
        <Slider.Slide>
          <div style={{ width: 100, height: 100, position: "relative" }}>
            <Image
              src={"/SkyScanner.webp"}
              fill
              objectFit="contain"
              alt="SkyScanner"
            />
          </div>
        </Slider.Slide>
        <Slider.Slide>
          <div style={{ width: 100, height: 100, position: "relative" }}>
            <Image
              src={"/Booking.webp"}
              fill
              objectFit="contain"
              alt="Booking"
            />
          </div>
        </Slider.Slide>
        <Slider.Slide>
          <div style={{ width: 100, height: 100, position: "relative" }}>
            <Image
              src={"/TripAdvisor.webp"}
              fill
              objectFit="contain"
              alt="TripAdvisor"
            />
          </div>
        </Slider.Slide>
        <Slider.Slide>
          <div style={{ width: 100, height: 100, position: "relative" }}>
            <Image src={"/Maps.webp"} fill objectFit="contain" alt="Maps" />
          </div>
        </Slider.Slide>
      </Slider>
    </div>
  );
};

export default LogoSlider;
