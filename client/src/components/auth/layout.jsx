// import { Outlet } from "react-router-dom";

// function AuthLayout() {
//   return (
//     <div className="flex min-h-screen w-full">
//       <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
//         <div className="max-w-md space-y-6 text-center text-primary-foreground">
//           <h1 className="text-4xl font-extrabold tracking-tight">
//             Welcome to ECommerce Shopping
//           </h1>
//         </div>
//       </div>
//       <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

// export default AuthLayout;








import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="fixed inset-0 flex w-full bg-gray-100">
      {/* Left Side - Background Image */}
      <div className="hidden lg:flex items-center justify-center relative w-1/2">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/www.jpg')",
            filter: "brightness(70%)",
          }}
        ></div>

        {/* Overlay Content */}
        <div className="relative z-10 max-w-md space-y-6 text-center text-white animate-fade-in">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Welcome to <span className="lookgood-text">LookGood</span>
          </h1>
          <p className="text-lg opacity-90">
            Discover the latest trends in fashion from top brands.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center bg-white shadow-lg rounded-lg px-4 py-12 sm:px-6 lg:px-8 animate-slide-in overflow-y-auto">
        <Outlet />
      </div>

      {/* Glow Effect CSS */}
      <style>
        {`
          /* LookGood Text Neon Glow */
          .lookgood-text {
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
                         0 0 20px rgba(255, 255, 255, 0.6),
                         0 0 30px rgba(0, 132, 255, 0.8),
                         0 0 40px rgba(0, 132, 255, 0.7);
            animation: glow 2s infinite alternate ease-in-out;
          }

          /* Glow Animation */
          @keyframes glow {
            0% {
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.7),
                           0 0 15px rgba(255, 255, 255, 0.5),
                           0 0 25px rgba(0, 132, 255, 0.7),
                           0 0 35px rgba(0, 132, 255, 0.6);
            }
            100% {
              text-shadow: 0 0 10px rgba(255, 255, 255, 1),
                           0 0 20px rgba(255, 255, 255, 0.8),
                           0 0 30px rgba(0, 132, 255, 1),
                           0 0 50px rgba(0, 132, 255, 0.9);
            }
          }
        `}
      </style>
    </div>
  );
}

export default AuthLayout;
