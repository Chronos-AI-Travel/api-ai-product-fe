import Image from "next/image";
import Slider from "react-infinite-logo-slider";

const LogoSlider = () => {
  return (
    <div className="py-4 bg-gray-100 w-screen">
      <Slider
        width="150px" // Assuming you want to keep this as a fixed width for the slider itself
        duration={40}
        pauseOnHover={false}
        blurBorders={false}
        blurBoderColor={"#fff"}
      >
        <Slider.Slide>
          <div>
            <Image
              src="/Uber.webp"
              alt="Uber"
              width={100} // Adjust the width as needed
              height={100} // Adjust the height as needed
              style={{ objectFit: "cover" }} // Apply object-fit directly
            />
            {/* Repeat for other images */}
          </div>
        </Slider.Slide>
        <Slider.Slide>
          <div>
            <Image
              src="/SkyScanner.webp"
              alt="Uber"
              width={100} // Adjust the width as needed
              height={100} // Adjust the height as needed
              style={{ objectFit: "cover" }} // Apply object-fit directly
            />
            {/* Repeat for other images */}
          </div>
        </Slider.Slide>
        <Slider.Slide>
          <div>
            <Image
              src="/Booking.webp"
              alt="Uber"
              width={100} // Adjust the width as needed
              height={100} // Adjust the height as needed
              style={{ objectFit: "cover" }} // Apply object-fit directly
            />
            {/* Repeat for other images */}
          </div>
        </Slider.Slide>
        <Slider.Slide>
          <div>
            <Image
              src="/TripAdvisor.webp"
              alt="Uber"
              width={100} // Adjust the width as needed
              height={100} // Adjust the height as needed
              style={{ objectFit: "cover" }} // Apply object-fit directly
            />
            {/* Repeat for other images */}
          </div>
        </Slider.Slide>
        <Slider.Slide>
          <div>
            <Image
              src="/Maps.webp"
              alt="Uber"
              width={100} // Adjust the width as needed
              height={100} // Adjust the height as needed
              style={{ objectFit: "cover" }} // Apply object-fit directly
            />
            {/* Repeat for other images */}
          </div>
        </Slider.Slide>
      </Slider>
    </div>
  );
};

export default LogoSlider;
