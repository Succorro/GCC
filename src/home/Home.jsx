import Booking from "./Booking";
import Hero from "./Hero";
import Pricing from "./Pricing";
import SlideShow from "./SlideShow";

export const Home = () => (
  <div className="pt-20 px-5 bg-indigo-50 w-[100vw]">
    <Hero />
    <SlideShow />
    <Pricing />
    <Booking />
  </div>
);
