// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { useNavigate } from "react-router-dom";

// function PaymentSuccessPage() {
//   const navigate = useNavigate();

//   return (
//     <Card className="p-10">
//       <CardHeader className="p-0">
//         <CardTitle className="text-4xl">Payment is successfull!</CardTitle>
//       </CardHeader>
//       <Button className="mt-5" onClick={() => navigate("/shop/account")}>
//         View Orders
//       </Button>
//     </Card>
//   );
// }

// export default PaymentSuccessPage;









// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { useNavigate } from "react-router-dom";
// import { 
//   CheckCircle, Package, Truck, ShoppingBag, Calendar, Home, 
//   MapPin, Box, Clock, X, ShoppingCart, ArrowRight
// } from "lucide-react";

// function PaymentSuccessPage() {
//   const navigate = useNavigate();
//   const [showTrackingModal, setShowTrackingModal] = useState(false);
  
//   // You would typically get this from your order state or API
//   const orderNumber = "ORD-12345";
//   const estimatedDelivery = "March 15, 2025";
  
//   // Mock data for suggested products
//   const suggestedProducts = [
//     { id: 1, name: "Wireless Headphones", price: "$89.99", image: "/api/placeholder/100/100" },
//     { id: 2, name: "Smart Watch", price: "$129.99", image: "/api/placeholder/100/100" },
//     { id: 3, name: "Bluetooth Speaker", price: "$59.99", image: "/api/placeholder/100/100" },
//   ];

//   return (
//     <>
//       <Card className="mt-10 max-w-3xl mx-auto">
//         <CardHeader className="text-center">
//           <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//           <CardTitle className="text-3xl">Payment Successful!</CardTitle>
//           <p className="text-gray-500 mt-2">Order #{orderNumber} has been confirmed</p>
//         </CardHeader>
        
//         <CardContent className="space-y-6">
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-medium mb-2 flex items-center">
//               <Truck className="mr-2 w-5 h-5" /> 
//               Delivery Status
//             </h3>
//             <div className="flex justify-between items-center mt-4">
//               <div className="flex flex-col items-center">
//                 <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
//                 <p className="text-xs mt-1">Order Placed</p>
//               </div>
//               <div className="h-1 flex-1 bg-gray-200 mx-2">
//                 <div className="h-1 bg-green-500 w-1/4"></div>
//               </div>
//               <div className="flex flex-col items-center">
//                 <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">2</div>
//                 <p className="text-xs mt-1">Processing</p>
//               </div>
//               <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
//               <div className="flex flex-col items-center">
//                 <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">3</div>
//                 <p className="text-xs mt-1">Shipped</p>
//               </div>
//               <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
//               <div className="flex flex-col items-center">
//                 <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">4</div>
//                 <p className="text-xs mt-1">Delivered</p>
//               </div>
//             </div>
//             <p className="text-sm mt-4 text-gray-600">
//               Estimated delivery: <span className="font-medium">{estimatedDelivery}</span>
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Button 
//               variant="outline" 
//               className="flex items-center justify-center" 
//               onClick={() => setShowTrackingModal(true)}
//             >
//               <Package className="mr-2 w-4 h-4" />
//               Track Order
//             </Button>
            
//             <Button 
//               variant="outline" 
//               className="flex items-center justify-center"
//               onClick={() => navigate("/shop/account")}
//             >
//               <ShoppingBag className="mr-2 w-4 h-4" />
//               View All Orders
//             </Button>
            
//             <Button 
//               variant="outline" 
//               className="flex items-center justify-center"
//               onClick={() => navigate("/shop/products")}
//             >
//               <Calendar className="mr-2 w-4 h-4" />
//               Continue Shopping
//             </Button>
            
//             <Button 
//               variant="outline" 
//               className="flex items-center justify-center"
//               onClick={() => navigate("/")}
//             >
//               <Home className="mr-2 w-4 h-4" />
//               Back to Home
//             </Button>
//           </div>
          
//           {/* Recommended Products Section */}
//           <div className="mt-8">
//             <h3 className="font-medium text-lg mb-4">Recommended For You</h3>
//             <div className="grid grid-cols-3 gap-4">
//               {suggestedProducts.map(product => (
//                 <div key={product.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
//                   <img src={product.image} alt={product.name} className="mx-auto mb-2" />
//                   <h4 className="font-medium text-sm truncate">{product.name}</h4>
//                   <p className="text-sm text-gray-600">{product.price}</p>
//                   <Button 
//                     size="sm" 
//                     variant="ghost" 
//                     className="w-full mt-2 text-xs flex items-center justify-center"
//                     onClick={() => navigate(`/shop/products/${product.id}`)}
//                   >
//                     <ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart
//                   </Button>
//                 </div>
//               ))}
//             </div>
//             <Button 
//               variant="link" 
//               className="mt-4 flex items-center mx-auto"
//               onClick={() => navigate("/shop/products")}
//             >
//               View more products <ArrowRight className="ml-1 w-4 h-4" />
//             </Button>
//           </div>
//         </CardContent>
        
//         <CardFooter className="flex-col space-y-4">
//           <div className="text-sm text-gray-500 text-center">
//             We've sent a confirmation email to your registered email address
//           </div>
//           <div className="text-xs text-gray-400 text-center">
//             If you have any questions, please contact our support team
//           </div>
//         </CardFooter>
//       </Card>

//       {/* Track Order Modal */}
//       {showTrackingModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
//             <Button 
//               variant="ghost" 
//               className="absolute right-2 top-2 p-1 h-auto" 
//               onClick={() => setShowTrackingModal(false)}
//             >
//               <X className="w-5 h-5" />
//             </Button>
            
//             <h2 className="text-xl font-bold mb-4">Track Your Order</h2>
//             <p className="text-gray-600 mb-4">Order #{orderNumber}</p>
            
//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//               <div className="flex flex-col space-y-8 relative">
//                 <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                
//                 <div className="flex relative z-10">
//                   <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-4">
//                     <CheckCircle className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Order Placed</h3>
//                     <p className="text-sm text-gray-500">March 10, 2025 - 09:15 AM</p>
//                     <p className="text-sm mt-1">Your order has been confirmed and is being prepared</p>
//                   </div>
//                 </div>
                
//                 <div className="flex relative z-10">
//                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
//                     <Box className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Processing</h3>
//                     <p className="text-sm text-gray-500">Estimated: March 11, 2025</p>
//                     <p className="text-sm mt-1">Your order is being processed and packed</p>
//                   </div>
//                 </div>
                
//                 <div className="flex relative z-10">
//                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
//                     <Truck className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Shipped</h3>
//                     <p className="text-sm text-gray-500">Estimated: March 12, 2025</p>
//                     <p className="text-sm mt-1">Your order will be handed to our shipping partner</p>
//                   </div>
//                 </div>
                
//                 <div className="flex relative z-10">
//                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
//                     <MapPin className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">Out for Delivery</h3>
//                     <p className="text-sm text-gray-500">Estimated: March 15, 2025</p>
//                     <p className="text-sm mt-1">Your order will be delivered to your address</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="border p-4 rounded-lg">
//               <h3 className="font-medium mb-2 flex items-center">
//                 <Clock className="mr-2 w-4 h-4" />
//                 Delivery Information
//               </h3>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <p className="text-gray-500">Shipping Address</p>
//                   <p>123 Main Street</p>
//                   <p>Apt 4B</p>
//                   <p>New York, NY 10001</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Shipping Method</p>
//                   <p>Express Delivery</p>
//                   <p className="text-gray-500 mt-2">Contact</p>
//                   <p>customer@example.com</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="mt-6 flex justify-between">
//               <Button variant="outline" onClick={() => setShowTrackingModal(false)}>
//                 Close
//               </Button>
//               <Button onClick={() => navigate("/shop/account/support")}>
//                 Need Help?
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default PaymentSuccessPage;





import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { 
  CheckCircle, Package, Truck, ShoppingBag, Calendar, 
  MapPin, Box, Clock, X, ShoppingCart, ArrowRight, Star,
  Share2, Gift, Heart, Filter, Smartphone, Mail
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [emailAddress, setEmailAddress] = useState("user@example.com");
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const navigate = useNavigate();
  
  // Get order details from location state
  const location = useLocation();
  
  // Generate random order number
  const generateOrderNumber = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${randomNum}`;
  };
  
  // Order details
  const [orderNumber, setOrderNumber] = useState(generateOrderNumber());
  const estimatedDelivery = "March 15, 2025";
  
  // Order details based on checkout information
  const [orderDetails, setOrderDetails] = useState({
    items: [],
    subtotal: "$0.00",
    shipping: "$0.00",
    tax: "$0.00",
    total: "$0.00",
    paymentMethod: "Visa •••• 4242",
  });
  
  // Fetch order items from location state or local storage on component mount
  useEffect(() => {
    const fetchOrderData = () => {
      try {
        // First try to get data from location state
        if (location?.state?.orderItems && location.state.orderItems.length > 0) {
          console.log("Found order items in location state:", location.state.orderItems);
          const items = location.state.orderItems;
          setOrderItems(items);
          
          // Calculate order details
          const subtotal = items.reduce((sum, item) => 
            sum + (parseFloat(item.price) * item.quantity), 0
          );
          
          const shipping = location.state.shipping || 0;
          const tax = subtotal * 0.07; // Assume 7% tax
          const total = subtotal + tax + shipping;
          
          setOrderDetails({
            items: items.map(item => ({
              name: item.title,
              quantity: item.quantity,
              price: `$${(parseFloat(item.price) * item.quantity).toFixed(2)}`
            })),
            subtotal: `$${subtotal.toFixed(2)}`,
            shipping: shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`,
            tax: `$${tax.toFixed(2)}`,
            total: `$${total.toFixed(2)}`,
            paymentMethod: location.state.paymentMethod || "Visa •••• 4242"
          });
          
          // Save this order to localStorage as a backup
          localStorage.setItem('lastOrderItems', JSON.stringify(items));
          if (location.state.paymentMethod) {
            localStorage.setItem('paymentMethod', location.state.paymentMethod);
          }
        } 
        // Try to get data from sessionStorage (alternative approach)
        else if (sessionStorage.getItem('checkoutData')) {
          console.log("Found checkout data in sessionStorage");
          const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData'));
          if (checkoutData.items && checkoutData.items.length > 0) {
            setOrderItems(checkoutData.items);
            
            const subtotal = checkoutData.subtotal || 
              checkoutData.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
            
            const shipping = checkoutData.shipping || 0;
            const tax = checkoutData.tax || (subtotal * 0.07);
            const total = checkoutData.total || (subtotal + tax + shipping);
            
            setOrderDetails({
              items: checkoutData.items.map(item => ({
                name: item.title,
                quantity: item.quantity,
                price: `$${(parseFloat(item.price) * item.quantity).toFixed(2)}`
              })),
              subtotal: `$${subtotal.toFixed(2)}`,
              shipping: shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`,
              tax: `$${tax.toFixed(2)}`,
              total: `$${total.toFixed(2)}`,
              paymentMethod: checkoutData.paymentMethod || "Visa •••• 4242"
            });
            
            // Check for email in checkout data
            if (checkoutData.email) {
              setEmailAddress(checkoutData.email);
            }
          }
        }
        // Fallback to localStorage if items weren't passed via router or sessionStorage
        else {
          console.log("Falling back to localStorage data");
          const savedOrderItems = JSON.parse(localStorage.getItem('lastOrderItems') || '[]');
          if (savedOrderItems.length > 0) {
            setOrderItems(savedOrderItems);
            
            // Calculate order details from saved items
            const subtotal = savedOrderItems.reduce((sum, item) => 
              sum + (parseFloat(item.price) * item.quantity), 0
            );
            
            const shipping = 0; // Default free shipping
            const tax = subtotal * 0.07;
            const total = subtotal + tax + shipping;
            
            setOrderDetails({
              items: savedOrderItems.map(item => ({
                name: item.title,
                quantity: item.quantity,
                price: `$${(parseFloat(item.price) * item.quantity).toFixed(2)}`
              })),
              subtotal: `$${subtotal.toFixed(2)}`,
              shipping: shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`,
              tax: `$${tax.toFixed(2)}`,
              total: `$${total.toFixed(2)}`,
              paymentMethod: localStorage.getItem('paymentMethod') || "Visa •••• 4242"
            });
          } else {
            console.warn("No order data found in any storage mechanism");
          }
        }
      } catch (error) {
        console.error("Error processing order data:", error);
      }
      
      // Generate a new random order number on each order
      setOrderNumber(generateOrderNumber());
    };
    
    fetchOrderData();
  }, [location]);
  
  // Handle navigation to continue shopping
  const handleContinueShopping = () => {
    window.scrollTo(0, 0);
    navigate('/shop/home');
  };
  
  // Handle navigation to product listing
  const handleViewMoreProducts = () => {
    window.scrollTo(0, 0);
    navigate('/shop/listing');
  };
  
  // Handle contact support
  const handleContactSupport = () => {
    const supportInfo = {
      phone: '8125875459',
      email: 'manojvandana89@gmail.com'
    };
    
    // Show support info in a modal or redirect to contact page
    alert(`Contact our support team:\nPhone: ${supportInfo.phone}\nEmail: ${supportInfo.email}`);
  };
  
  // Handle email subscription
  const handleEmailSubscribe = async () => {
    setEmailSending(true);
    setEmailError(null);
    
    try {
      // Simulate API call to send the email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would call an API endpoint here
      // const response = await fetch('/api/send-order-email', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: emailAddress,
      //     orderNumber: orderNumber,
      //     orderDetails: orderDetails,
      //     estimatedDelivery: estimatedDelivery,
      //     type: 'order_confirmation'
      //   })
      // });
      
      // if (!response.ok) throw new Error('Failed to send email');
      
      console.log("Sending order notification email to", emailAddress);
      console.log("Email content:", {
        orderNumber,
        orderItems: orderDetails.items,
        total: orderDetails.total,
        estimatedDelivery
      });
      
      setEmailSubscribed(true);
      setEmailSent(true);
      
      // Store email preference
      localStorage.setItem('userEmail', emailAddress);
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailError("Failed to send email. Please try again.");
    } finally {
      setEmailSending(false);
    }
  };
  
  // Handle resend confirmation email
  const handleResendEmail = async () => {
    setEmailSending(true);
    setEmailError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Resending order confirmation email to", emailAddress);
      alert(`Confirmation email resent to ${emailAddress}`);
    } catch (error) {
      setEmailError("Failed to resend email. Please try again.");
    } finally {
      setEmailSending(false);
    }
  };
  
  // Generate recommended products based on purchased items
  const suggestedProducts = orderItems.length > 0 
    ? orderItems.map((item, index) => ({
        id: index + 1,
        name: `${item.title} Accessories`,
        price: `$${(parseFloat(item.price) * 0.5).toFixed(2)}`,
        discountPrice: index % 2 === 0 ? `$${(parseFloat(item.price) * 0.4).toFixed(2)}` : null,
        image: item.image || "/api/placeholder/100/100",
        rating: (4 + Math.random()).toFixed(1),
        reviewCount: Math.floor(Math.random() * 200) + 50,
        badge: index % 3 === 0 ? "Best Seller" : index % 3 === 1 ? "New" : "Sale"
      })).slice(0, 3)
    : [
        { id: 1, name: "Airdopes", price: "$89.99", discountPrice: "$79.99", image: "/images/boat.jpg", rating: 4.7, reviewCount: 128, badge: "Best Seller" },
        { id: 2, name: "Smart Watch", price: "$129.99", discountPrice: null, image: "/images/fastrack.webp", rating: 4.5, reviewCount: 86, badge: "New" },
        { id: 3, name: "shoes", price: "$59.99", discountPrice: "$49.99", image: "/images/Nikesh.png", rating: 4.8, reviewCount: 210, badge: "Sale" },
      ];

  return (
    <>
      <Card className="mt-10 max-w-3xl mx-auto">
        {/* Success Header */}
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">Thank You For Your Purchase!</CardTitle>
          <p className="text-gray-500 mt-2">Order #{orderNumber} has been confirmed</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Order Summary Banner */}
          <div className="bg-gray-50 rounded-lg p-5 flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-medium text-lg">Order Summary</h3>
              <p className="text-gray-600">Placed on March 10, 2025</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center"
                onClick={handleResendEmail}
                disabled={emailSending}
              >
                <Mail className="mr-1 w-4 h-4" /> Email Details
              </Button>
            </div>
          </div>
          
          {/* Delivery Status Tracker */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <Truck className="mr-2 w-5 h-5" /> 
              Delivery Status
            </h3>
            <div className="flex justify-between items-center mt-4">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>
                <p className="text-xs mt-1">Order Placed</p>
              </div>
              <div className="h-1 flex-1 bg-gray-200 mx-2">
                <div className="h-1 bg-green-500 w-1/4"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">2</div>
                <p className="text-xs mt-1">Processing</p>
              </div>
              <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">3</div>
                <p className="text-xs mt-1">Shipped</p>
              </div>
              <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">4</div>
                <p className="text-xs mt-1">Delivered</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                Estimated delivery: <span className="font-medium">{estimatedDelivery}</span>
              </p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm" 
                onClick={() => setShowTrackingModal(true)}
              >
                View Details
              </Button>
            </div>
          </div>

          {/* Mobile App Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white flex justify-between items-center">
            <div className="flex items-center">
              <Smartphone className="w-8 h-8 mr-3" />
              <div>
                <h3 className="font-bold">Track on the go!</h3>
                <p className="text-sm">Download our app for real-time updates</p>
              </div>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Get App
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center" 
              onClick={() => setShowTrackingModal(true)}
            >
              <Package className="mr-2 w-4 h-4" />
              Track Order
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
            >
              <ShoppingBag className="mr-2 w-4 h-4" />
              View All Orders
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
              onClick={handleContinueShopping}
            >
              <Calendar className="mr-2 w-4 h-4" />
              Continue Shopping
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center"
              onClick={handleContactSupport}
            >
              <Mail className="mr-2 w-4 h-4" />
              Contact Support
            </Button>
          </div>
          
          {/* Review Request */}
          {!showReviewPrompt && (
            <Button 
              variant="ghost" 
              className="w-full border border-dashed border-gray-300 py-6 hover:bg-gray-50"
              onClick={() => setShowReviewPrompt(true)}
            >
              <Star className="mr-2 w-5 h-5 text-yellow-400" />
              Rate your shopping experience
            </Button>
          )}
          
          {showReviewPrompt && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Rate your experience</h3>
              <div className="flex space-x-2 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} className="text-yellow-400 hover:scale-110 transition-transform">
                    <Star className="w-6 h-6" fill="#FBBF24" />
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full border rounded-md p-2 text-sm mb-2" 
                rows="2"
                placeholder="Tell us about your experience (optional)"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setShowReviewPrompt(false)}>Cancel</Button>
                <Button size="sm">Submit Review</Button>
              </div>
            </div>
          )}
          
          {/* Recommended Products */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Recommended For You</h3>
              {/* <Button variant="ghost" size="sm" className="flex items-center">
                <Filter className="w-4 h-4 mr-1" /> Filter
              </Button> */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {suggestedProducts.map(product => (
                <div key={product.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="relative">
                    {product.badge && (
                      <span className={`absolute top-2 left-2 text-xs font-bold py-1 px-2 rounded-full z-10 ${
                        product.badge === 'Sale' ? 'bg-red-100 text-red-800' : 
                        product.badge === 'New' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                    <div className="relative h-24 flex items-center justify-center">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain" 
                      />
                      <button className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm truncate mt-2">{product.name}</h4>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      <Star className="w-3 h-3 text-yellow-400" fill="#FBBF24" />
                      <span className="text-xs ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {product.discountPrice ? (
                      <>
                        <span className="text-sm font-medium">{product.discountPrice}</span>
                        <span className="text-xs text-gray-500 line-through ml-2">{product.price}</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium">{product.price}</span>
                    )}
                  </div>
                  {/* <Button 
                    size="sm" 
                    className="w-full mt-2 text-xs"
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart
                  </Button> */}
                </div>
              ))}
            </div>
            <Button 
              variant="link" 
              className="mt-4 flex items-center mx-auto"
              onClick={handleViewMoreProducts}
            >
              View more products <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          
          {/* Email Notifications Section */}
          {!emailSubscribed ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">Stay updated with your order</h3>
              <p className="text-sm text-gray-600 mb-3">Receive notifications about your order status and delivery updates.</p>
              {emailError && (
                <div className="bg-red-50 text-red-600 p-2 mb-3 rounded text-sm border border-red-200">
                  {emailError}
                </div>
              )}
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 border rounded-md px-3 py-2 text-sm"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
                <Button 
                  onClick={handleEmailSubscribe}
                  disabled={emailSending}
                >
                  {emailSending ? "Sending..." : "Subscribe"}
                </Button>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex items-start">
                <input type="checkbox" className="mr-2 mt-1" id="additionalEmails" />
                <label htmlFor="additionalEmails">
                  I'd also like to receive promotional emails about new products and exclusive offers
                </label>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="font-medium">Email notifications enabled</h3>
              </div>
              
              <p className="text-sm mb-3">
                We've sent a confirmation email to <span className="font-medium">{emailAddress}</span>.
                You'll receive updates about your order status and delivery.
              </p>
              
              <div className="text-sm text-gray-600 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Order confirmation email sent</span>
              </div>
              
              <div className="text-sm text-gray-600 flex items-center">
                <Clock className="w-4 h-4 text-blue-500 mr-2" />
                <span>Shipping confirmation will be sent when your order ships</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleResendEmail}
                disabled={emailSending}
              >
                {emailSending ? "Sending..." : "Resend confirmation email"}
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex-col space-y-4">
          {emailSent ? (
            <div className="text-sm text-green-600 text-center flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmation email sent to {emailAddress}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center">
              Subscribe to receive order updates via email
            </div>
          )}
          <div className="text-xs text-gray-400 text-center">
            If you have any questions, please contact our support team
          </div>
        </CardFooter>
      </Card>

      {/* Track Order Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <Button 
              variant="ghost" 
              className="absolute right-2 top-2 p-1 h-auto" 
              onClick={() => setShowTrackingModal(false)}
            >
              <X className="w-5 h-5" />
            </Button>
            
            <h2 className="text-xl font-bold mb-4">Track Your Order</h2>
            <p className="text-gray-600 mb-4">Order #{orderNumber}</p>
            
            {/* Map preview */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              {!showMap ? (
                <div 
                  className="bg-blue-100 h-40 flex items-center justify-center cursor-pointer"
                  onClick={() => setShowMap(true)}
                >
                  <MapPin className="w-8 h-8 text-blue-500" />
                  <p className="text-sm ml-2">Click to view delivery map</p>
                </div>
              ) : (
                <div className="h-64 relative">
                  <div className="absolute inset-0 bg-gray-100">
                    <img 
                      src="/api/placeholder/600/400" 
                      alt="Delivery Map" 
                      className="w-full h-full object-cover"
                    />
                    {/* Map Overlay with Route */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        {/* Origin Point */}
                        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rounded-full"></div>
                        
                        {/* Destination Point */}
                        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-red-500 rounded-full"></div>
                        <MapPin className="absolute bottom-1/4 right-1/4 w-8 h-8 text-red-500 -ml-4 -mb-8" />
                        
                        {/* Route Path */}
                        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <path 
                            d="M25% 25% Q50% 30%, 75% 75%" 
                            stroke="blue" 
                            strokeWidth="3" 
                            fill="none" 
                            strokeDasharray="5,5"
                          />
                        </svg>
                        
                        {/* Truck Icon */}
                        <div className="absolute top-1/3 left-1/2 -ml-4 -mt-4">
                          <Truck className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-3 bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Estimated Arrival</p>
                  <p className="text-sm text-gray-500">{estimatedDelivery}</p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                >
                  {showMap ? "Hide Map" : "View Live Map"}
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex flex-col space-y-8 relative">
                <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                
                <div className="flex relative z-10">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-4">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Placed</h3>
                    <p className="text-sm text-gray-500">March 10, 2025 - 09:15 AM</p>
                    <p className="text-sm mt-1">Your order has been confirmed and is being prepared</p>
                  </div>
                </div>
                
                <div className="flex relative z-10">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Processing</h3>
                    <p className="text-sm text-gray-500">Estimated: March 11, 2025</p>
                    <p className="text-sm mt-1">Your order is being processed and packed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PaymentSuccessPage