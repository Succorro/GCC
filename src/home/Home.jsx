import Booking from "./Booking";
import Footer from "./Footer";
import Hero from "./Hero";
import Pricing from "./Pricing";
import Ready from "./Ready";
import SlideShow from "./SlideShow";
import { useState } from 'react';

export const Home = () => {
  const [bookingIsOpen, setBookingIsOpen] = useState(false);

  const handleBookingToggle = () => {
    setBookingIsOpen(prev => !prev)
  }
  return (
    <div className="mt-16 w-[101vw]">
      <Hero onBookingClick={handleBookingToggle} />
      <SlideShow />
      <Pricing />
      <Ready onBookingClick={handleBookingToggle} />
      <Booking onBookingClick={handleBookingToggle} bookingIsOpen={bookingIsOpen} />
      <Footer />
    </div>
  )
};
