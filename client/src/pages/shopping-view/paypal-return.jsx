// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { capturePayment } from "@/store/shop/order-slice";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useLocation } from "react-router-dom";

// function PaypalReturnPage() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const paymentId = params.get("paymentId");
//   const payerId = params.get("PayerID");

//   useEffect(() => {
//     if (paymentId && payerId) {
//       const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

//       dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
//         if (data?.payload?.success) {
//           sessionStorage.removeItem("currentOrderId");
//           window.location.href = "/shop/payment-success";
//         }
//       });
//     }
//   }, [paymentId, payerId, dispatch]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Processing Payment...Please wait!</CardTitle>
//       </CardHeader>
//     </Card>
//   );
// }

// export default PaypalReturnPage;


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Loader2, CheckCircle, ShoppingBag, CreditCard, Box, Truck, XCircle } from "lucide-react";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  
  // State for tracking processing steps
  const [processingStep, setProcessingStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);
  
  // Audio reference for success sound
  const successAudioRef = useRef(null);
  
  // Processing steps for visualization
  const steps = [
    { id: 1, title: "Verifying Payment", icon: CreditCard, delay: 750 },
    { id: 2, title: "Confirming Order Details", icon: ShoppingBag, delay: 1000 },
    { id: 3, title: "Processing Transaction", icon: Box, delay: 1250 },
    { id: 4, title: "Preparing Shipment", icon: Truck, delay: 1000 }
  ];

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      
      // Simulate step progression for better UX
      let currentStep = 1;
      const totalTime = 4000; // 4 seconds total processing time
      
      // Progress through visualization steps with calculated delays
      const progressSteps = () => {
        if (currentStep <= steps.length) {
          setProcessingStep(currentStep);
          currentStep++;
          
          if (currentStep <= steps.length) {
            setTimeout(progressSteps, steps[currentStep-2].delay);
          } else {
            // Play success sound when all steps complete
            if (successAudioRef.current && isSuccess) {
              setTimeout(() => {
                successAudioRef.current.play();
              }, 300);
            }
          }
        }
      };
      
      // Start the visualization
      progressSteps();
      
      // Actual payment capture
      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          // Wait for visualization to complete before showing success
          setTimeout(() => {
            setIsProcessing(false);
            sessionStorage.removeItem("currentOrderId");
            
            // Delay redirect for a moment to show completion
            setTimeout(() => {
              window.location.href = "/shop/payment-success";
            }, 2000);
          }, totalTime);
        } else {
          // Handle failure case
          setTimeout(() => {
            setIsSuccess(false);
            setIsProcessing(false);
          }, totalTime);
        }
      }).catch(() => {
        // Handle error
        setTimeout(() => {
          setIsSuccess(false);
          setIsProcessing(false);
        }, totalTime);
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Success sound audio element */}
      <audio ref={successAudioRef}>
        <source src="/sounds/payment-success.mp3" type="audio/mpeg" />
      </audio>
      
      <Card className="mt-20 p-6 w-full max-w-md shadow-lg border-0 relative overflow-hidden">
        {/* Progress bar at top of card */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
          <div 
            className="h-full transition-all duration-500 ease-out"
            style={{ 
              width: isProcessing ? `${(processingStep / steps.length) * 100}%` : '100%',
              backgroundImage: isSuccess 
                ? isProcessing 
                  ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' 
                  : 'linear-gradient(90deg, #10b981, #34d399)'
                : 'linear-gradient(90deg, #ef4444, #f87171)',
            }}
          ></div>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-2xl text-gray-800">
            {isProcessing 
              ? "Processing Your Payment" 
              : isSuccess 
                ? "Payment Verified!" 
                : "Payment Failed"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-4">
          {/* Order Processing Animation */}
          <div className="flex justify-center mb-8 mt-4">
            {isProcessing ? (
              <div className="relative">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              </div>
            ) : isSuccess ? (
              <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          
          {/* Processing Steps */}
          <div className="space-y-4 max-w-xs mx-auto">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className={`flex-shrink-0 rounded-full p-2 ${
                  !isProcessing && isSuccess
                    ? "bg-green-100 text-green-600"
                    : !isProcessing && !isSuccess
                      ? "bg-red-100 text-red-600"
                      : processingStep > step.id 
                        ? "bg-green-100 text-green-600" 
                        : processingStep === step.id 
                          ? "bg-blue-100 text-blue-600 animate-pulse" 
                          : "bg-gray-100 text-gray-400"
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    !isProcessing && isSuccess
                      ? "text-green-800"
                      : !isProcessing && !isSuccess
                        ? "text-red-800"
                        : processingStep > step.id 
                          ? "text-green-800" 
                          : processingStep === step.id 
                            ? "text-blue-800" 
                            : "text-gray-500"
                  }`}>
                    {step.title}
                  </p>
                  <div className={`mt-1 h-1 w-full rounded-full ${
                    !isProcessing && isSuccess
                      ? "bg-green-500"
                      : !isProcessing && !isSuccess
                        ? "bg-red-500"
                        : processingStep > step.id 
                          ? "bg-green-500" 
                          : processingStep === step.id 
                            ? "bg-gradient-to-r from-blue-400 to-blue-100" 
                            : "bg-gray-200"
                  }`}>
                    {processingStep === step.id && (
                      <div className="h-full bg-blue-600 rounded-full animate-pulse-slow w-1/2"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Status Message */}
          <div className="mt-8 text-center">
            <p className={`text-sm ${
              isProcessing 
                ? "text-gray-600" 
                : isSuccess 
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
            }`}>
              {isProcessing 
                ? "Please don't close this window while we process your payment..." 
                : isSuccess 
                  ? "Payment successful! Redirecting you to the confirmation page..." 
                  : "Payment verification failed. Please try again or contact support."}
            </p>
          </div>
          
          {/* Order estimation info or Error info */}
          {!isProcessing && (
            <div className={`mt-6 p-4 rounded-lg border animate-fade-in ${
              isSuccess 
                ? "bg-blue-50 border-blue-100" 
                : "bg-red-50 border-red-100"
            }`}>
              {isSuccess ? (
                <>
                  <h3 className="text-sm font-medium text-blue-800 flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    Shipping Information
                  </h3>
                  <p className="text-xs text-blue-600 mt-1">
                    Your order will be processed within 24 hours and shipped via express delivery.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-medium text-red-800 flex items-center">
                    <XCircle className="h-4 w-4 mr-2" />
                    Payment Error
                  </h3>
                  <p className="text-xs text-red-600 mt-1">
                    We couldn't verify your payment. Please check your payment details or try an alternative payment method.
                  </p>
                  <button className="mt-2 px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Try Again
                  </button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Security badge */}
      <div className="mt-6 flex items-center text-gray-500 text-xs">
        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.478 0 0 4.478 0 10c0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10zm0 5c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z" clipRule="evenodd" />
        </svg>
        Secured by 256-bit SSL Encryption
      </div>
    </div>
  );
}

// Add necessary animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes fade-in {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default PaypalReturnPage;