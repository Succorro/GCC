# Gabriel Car Cleaning Web App

This is a web application built for Gabriel Car Cleaning, a professional car detailing and cleaning service. The app allows customers to book appointments, view available services, and manage their bookings online with a seamless and detailed user interface.

## Features

- **Service Listings:** View a list of available car cleaning services with detailed explanations and pricing.
- **Online Booking:** Customers can book appointments for their preferred services and time slots.
- **Seamless UI:** The application provides a smooth and intuitive user experience.

## Technologies Used

- **Front-end:** React 18 (Single Page Application), React Router, Tailwind CSS
- **Utilities:** ESLint, Prettier
- **Back-end:** Cloudflare Workers severless functionality

## Getting Started

To run the application locally, follow these steps:

1. Clone the repository: `git clone https://github.com/Succorro/GCC.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
* Optional: Intall wrangler cli for cloudflare
`npm intall -g @cloudflare/wrangler`
* Start Wrangler dev mode: `npx wrangler dev`

The application is set up using Vite for a seamless development experience with React. For more information on using Vite with React, refer to the [Vite + React Getting Started](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) guide.

## Deployment

The front-end is deployed on Cloudflare, and the back-end is running Cloudflare's Workers.

1. Build React app: `npm run build`
2. Deploy functions: `wrangler publish`

## Feedback and Support

While contributions are not accepted at the moment, feedback and inquiries are welcome. For any information or questions, please contact [stevengbmv@gmail.com](mailto:stevengbmv@gmail.com).

