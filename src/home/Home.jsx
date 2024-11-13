import Booking from "./Booking";
import Hero from "./Hero";
import Pricing from "./Pricing";
import Ready from "./Ready";
import SlideShow from "./SlideShow";

export const Home = () => (
  <div className="mt-16  w-[101vw]">
    <Hero />
    <SlideShow />
    <Pricing />
    <Ready />
    <Booking />
  </div>
);
