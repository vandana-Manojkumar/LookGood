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







import React, { useState } from 'react';
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  const [showForm, setShowForm] = useState(false);

  // Handle continue button click
  const handleContinue = () => {
    setShowForm(true);
  };

  return (
    <div className="fixed inset-0 w-full bg-gray-100">
      {/* Mobile Welcome Screen */}
      <div 
        className={`lg:hidden fixed inset-0 flex flex-col items-center justify-center transition-transform duration-500 ${
          showForm ? '-translate-y-full' : ''
        }`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/www.jpg')",
            filter: "brightness(70%)",
          }}
        />
        
        <div className="relative z-10 max-w-md space-y-6 text-center text-white p-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to <span className="lookgood-text">LookGood</span>
          </h1>
          <p className="text-lg opacity-90">
            Discover the latest trends in fashion from top brands.
          </p>
          <button
            onClick={handleContinue}
            className="mt-8 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-opacity-90 transition-colors"
          >
            Continue to Register
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex w-full h-full">
        {/* Left Side - Background Image (Desktop) */}
        <div className="hidden lg:flex items-center justify-center relative w-1/2">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/www.jpg')",
              filter: "brightness(70%)",
            }}
          />
          
          <div className="relative z-10 max-w-md space-y-6 text-center text-white">
            <h1 className="text-5xl font-extrabold tracking-tight">
              Welcome to <span className="lookgood-text">LookGood</span>
            </h1>
            <p className="text-lg opacity-90">
              Discover the latest trends in fashion from top brands.
            </p>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div 
          className={`flex-1 flex items-center justify-center bg-white shadow-lg rounded-lg px-4 py-12 sm:px-6 lg:px-8 transition-transform duration-500 ${
            !showForm && 'lg:translate-y-0 translate-y-full'
          }`}
        >
          <Outlet />
        </div>
      </div>

      {/* Glow Effect CSS */}
      <style>
        {`
          .lookgood-text {
            color: white;
            font-weight: bold;
            // text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
                         0 0 20px rgba(255, 255, 255, 0.6),
                         0 0 30px rgba(0, 132, 255, 0.8),
                         0 0 40px rgba(0, 132, 255, 0.7);
            animation: glow 2s infinite alternate ease-in-out;
          }

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
};

export default AuthLayout;