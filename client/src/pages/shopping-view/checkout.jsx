// import Address from "@/components/shopping-view/address";
// import img from "../../assets/account.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
// import { Button } from "@/components/ui/button";
// import { useState, useEffect } from "react";
// import { createNewOrder } from "@/store/shop/order-slice";
// import { Navigate } from "react-router-dom";
// import { useToast } from "@/components/ui/use-toast";
// import { Loader2, ChevronDown, ChevronUp, Gift, Sparkles, Copy, Check } from "lucide-react";

// function ShoppingCheckout() {
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { user } = useSelector((state) => state.auth);
//   const { approvalURL } = useSelector((state) => state.shopOrder);
//   const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
//   const [isPaymentStart, setIsPaymentStart] = useState(false);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   // Promo code states
//   const [promoCode, setPromoCode] = useState('');
//   const [appliedPromo, setAppliedPromo] = useState(null);
//   const [error, setError] = useState('');
//   const [showOffers, setShowOffers] = useState(false);
//   const [copiedCode, setCopiedCode] = useState('');
//   const [showCopiedAnimation, setShowCopiedAnimation] = useState(false);

//   // Enhanced promo codes with minimum purchase requirements
//   const availablePromoCodes = {
//     'SAVE10': { discount: 0.10, type: 'percentage', minPurchase: 50, description: '10% off on orders above $50' },
//     'SAVE20': { discount: 0.20, type: 'percentage', minPurchase: 100, description: '20% off on orders above $100' },
//     'SAVE30': { discount: 0.30, type: 'percentage', minPurchase: 150, description: '30% off on orders above $150' },
//     'SAVE40': { discount: 0.40, type: 'percentage', minPurchase: 200, description: '40% off on orders above $200' }
//   };

//   const calculateSubtotal = () => {
//     return cartItems && cartItems.items && cartItems.items.length > 0
//       ? cartItems.items.reduce(
//           (sum, currentItem) =>
//             sum +
//             (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) *
//               currentItem?.quantity,
//           0
//         )
//       : 0;
//   };

//   const applyPromoCode = (code = promoCode) => {
//     setError('');
//     const promo = availablePromoCodes[code.toUpperCase()];
//     const subtotal = calculateSubtotal();
    
//     if (!promo) {
//       setError('Invalid promo code');
//       return;
//     }

//     if (subtotal < promo.minPurchase) {
//       setError(`This code requires a minimum purchase of $${promo.minPurchase}`);
//       return;
//     }

//     setAppliedPromo({
//       code: code.toUpperCase(),
//       ...promo
//     });
//     setPromoCode('');
//     setShowOffers(false); // Close offers section after applying
//   };

//   const removePromoCode = () => {
//     setAppliedPromo(null);
//     setError('');
//   };

//   const calculateDiscount = () => {
//     if (!appliedPromo) return 0;
    
//     const subtotal = calculateSubtotal();
//     if (appliedPromo.type === 'percentage') {
//       return subtotal * appliedPromo.discount;
//     } else {
//       return appliedPromo.discount;
//     }
//   };

//   const getAvailableOffers = () => {
//     const subtotal = calculateSubtotal();
//     return Object.entries(availablePromoCodes)
//       .filter(([_, promo]) => subtotal >= promo.minPurchase)
//       .map(([code, promo]) => ({
//         code,
//         ...promo
//       }));
//   };

//   const getNextOffer = () => {
//     const subtotal = calculateSubtotal();
//     const nextOffer = Object.entries(availablePromoCodes)
//       .filter(([_, promo]) => subtotal < promo.minPurchase)
//       .sort((a, b) => a[1].minPurchase - b[1].minPurchase)[0];
    
//     return nextOffer ? { 
//       code: nextOffer[0], 
//       remaining: nextOffer[1].minPurchase - subtotal,
//       ...nextOffer[1] 
//     } : null;
//   };

//   const copyToClipboard = (code) => {
//     setPromoCode(code);
//     setCopiedCode(code);
//     setShowCopiedAnimation(true);
//     setTimeout(() => setShowCopiedAnimation(false), 2000);
//   };

//   useEffect(() => {
//     if (appliedPromo && calculateSubtotal() < appliedPromo.minPurchase) {
//       removePromoCode();
//     }
//   }, [cartItems]);

//   const subtotal = calculateSubtotal();
//   const discount = calculateDiscount();
//   const total = subtotal - discount;
//   console.log(subtotal, typeof(subtotal));
//   console.log(discount, typeof(discount));
//   console.log(total, typeof(total));
//   const availableOffers = getAvailableOffers();
//   const nextOffer = getNextOffer();

//   function handleInitiatePaypalPayment() {
//     if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
//       toast({
//         title: "Your cart is empty. Please add items to proceed",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     if (currentSelectedAddress === null) {
//       toast({
//         title: "Please select one address to proceed.",
//         variant: "destructive",
//       });
//       return;
//     }
  
//     // Ensure we have proper number calculations without floating point errors
//     // Use Math.round to ensure we're working with exact cents (as integers) to avoid floating point issues
//     const currentSubtotal = Math.round(subtotal * 100) / 100;
//     const currentDiscount = appliedPromo ? Math.round(discount * 100) / 100 : 0;
//     const currentTotal = Math.round((currentSubtotal - currentDiscount) * 100) / 100;
  
//     // PayPal requires total to be greater than 0
//     if (isNaN(currentTotal) || currentTotal <= 0) {
//       toast({
//         title: "Invalid total amount",
//         description: "The order total must be greater than zero.",
//         variant: "destructive",
//       });
//       return;
//     }
  
//     // Ensure all cart items have valid prices
//     const formattedCartItems = cartItems.items.map((singleCartItem) => {
//       const itemPrice = singleCartItem?.salePrice > 0 
//         ? Math.round(singleCartItem?.salePrice * 100) / 100
//         : Math.round(singleCartItem?.price * 100) / 100;
      
//       // Validate that the item has a positive price
//       if (isNaN(itemPrice) || itemPrice <= 0) {
//         throw new Error(`Invalid price for item: ${singleCartItem?.title}`);
//       }
      
//       return {
//         productId: singleCartItem?.productId,
//         title: singleCartItem?.title,
//         image: singleCartItem?.image,
//         price: itemPrice,
//         quantity: parseInt(singleCartItem?.quantity, 10),
//       };
//     });
  
//     // Create the order data object with properly formatted values
//     const orderData = {
//       userId: user?.id,
//       cartId: cartItems?._id,
//       cartItems: formattedCartItems,
//       addressInfo: {
//         addressId: currentSelectedAddress?._id,
//         address: currentSelectedAddress?.address,
//         city: currentSelectedAddress?.city,
//         pincode: currentSelectedAddress?.pincode,
//         phone: currentSelectedAddress?.phone,
//         notes: currentSelectedAddress?.notes,
//       },
//       orderStatus: "pending",
//       paymentMethod: "paypal",
//       paymentStatus: "pending",
//       totalAmount: currentTotal,
//       discount: currentDiscount,  
//       promoCode: appliedPromo ? appliedPromo.code : null,
//       orderDate: new Date().toISOString(),
//       orderUpdateDate: new Date().toISOString(),
//       paymentId: "",
//       payerId: "",
//     };
  
//     console.log("Sending order data:", JSON.stringify(orderData));
  
//     setIsPaymentStart(true);
    
//     dispatch(createNewOrder(orderData))
//       .then((data) => {
//         if (data?.payload?.success) {
//           // Payment started successfully, will redirect via approvalURL
//           console.log("Order created successfully, waiting for approval URL");
//         } else {
//           setIsPaymentStart(false);
//           // Display error message
//           toast({
//             title: "Payment Error",
//             description: data?.payload?.message || "Failed to create order. Please try again.",
//             variant: "destructive",
//           });
//         }
//       })
//       .catch((error) => {
//         setIsPaymentStart(false);
//         console.error("Order creation error:", error);
//         toast({
//           title: "Error creating order",
//           description: "Please try again later or contact support.",
//           variant: "destructive",
//         });
//       });
//   }

//   // Redirect to PayPal if approvalURL is available
//   useEffect(() => {
//     if (approvalURL) {
//       window.location.href = approvalURL;
//     }
//   }, [approvalURL]);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="relative h-[300px] w-full overflow-hidden">
//         <img
//           src={img}
//           alt="Checkout Banner"
//           className="h-full w-full object-cover object-center"
//         />
//         <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//           <h1 className="text-4xl font-bold text-white">Checkout</h1>
//         </div>
//       </div>

//       {/* Checkout Content */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Address Section */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
//             <Address
//               selectedId={currentSelectedAddress}
//               setCurrentSelectedAddress={setCurrentSelectedAddress}
//             />
//           </div>

//           {/* Order Summary Section */}
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
//             <div className="space-y-4">
//               {cartItems && cartItems.items && cartItems.items.length > 0
//                 ? cartItems.items.map((item) => (
//                     <UserCartItemsContent key={item.productId} cartItem={item} />
//                   ))
//                 : null}
//             </div>
            
//             {/* Progress bar to next offer */}
//             {nextOffer && (
//               <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-200 shadow-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Gift className="h-5 w-5 text-amber-600" />
//                   <p className="text-sm font-medium text-amber-800">
//                     Add <span className="font-bold">${nextOffer.remaining.toFixed(2)}</span> more to unlock {nextOffer.description}
//                   </p>
//                 </div>
//                 <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-500 ease-out"
//                     style={{ width: `${Math.min(100, (subtotal / nextOffer.minPurchase) * 100)}%` }}
//                   ></div>
//                 </div>
//               </div>
//             )}
            
//             {/* Available Offers Section */}
//             <div className="mt-6">
//               <button
//                 onClick={() => setShowOffers(!showOffers)}
//                 className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-300 flex items-center justify-between"
//               >
//                 <div className="flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-blue-600" />
//                   <span className="font-medium text-blue-700">
//                     {availableOffers.length > 0 
//                       ? `${availableOffers.length} Offer${availableOffers.length > 1 ? 's' : ''} Available!` 
//                       : 'Special Offers'}
//                   </span>
//                 </div>
//                 {showOffers ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-blue-600" />}
//               </button>
              
//               {showOffers && (
//                 <div className="mt-3 max-h-52 overflow-y-auto pr-1 transition-all duration-300 ease-in-out">
//                   <div className="space-y-3">
//                     {availableOffers.length > 0 ? (
//                       availableOffers.map((offer) => (
//                         <div 
//                           key={offer.code} 
//                           className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
//                         >
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <div className="flex gap-2 items-center">
//                                 <span className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-sm">{offer.code}</span>
//                                 <span className="font-medium text-blue-800">
//                                   {offer.type === 'percentage' 
//                                     ? `${offer.discount * 100}% OFF` 
//                                     : `$${offer.discount} OFF`}
//                                 </span>
//                               </div>
//                               <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
//                             </div>
//                             <button 
//                               onClick={() => copyToClipboard(offer.code)}
//                               className="p-2 rounded-full bg-white hover:bg-blue-200 border border-blue-300 transition-colors duration-300"
//                             >
//                               {copiedCode === offer.code && showCopiedAnimation 
//                                 ? <Check className="h-4 w-4 text-green-600" /> 
//                                 : <Copy className="h-4 w-4 text-blue-600" />}
//                             </button>
//                           </div>
//                           <div className="mt-2">
//                             <button 
//                               onClick={() => applyPromoCode(offer.code)}
//                               className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-300"
//                             >
//                               Apply Code
//                             </button>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
//                         <p className="text-gray-600 mb-2">
//                           Shop more to unlock special offers!
//                         </p>
//                         <div className="mt-2 bg-white p-3 rounded-md border border-gray-200">
//                           <p className="text-sm font-medium text-gray-800">First offer available at $50</p>
//                           <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
//                             <div 
//                               className="h-full bg-gradient-to-r from-gray-400 to-blue-500 transition-all duration-500 ease-out"
//                               style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             {/* Promo code section */}
//             <div className="mt-6 space-y-4">
//               {!appliedPromo ? (
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     className="flex-1 px-3 py-2 border rounded-md"
//                     placeholder="Enter promo code"
//                     value={promoCode}
//                     onChange={(e) => setPromoCode(e.target.value)}
//                   />
//                   <button 
//                     onClick={() => applyPromoCode()}
//                     className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300"
//                   >
//                     Apply
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex justify-between items-center p-3 bg-green-100 text-green-700 rounded-md border border-green-200 shadow-sm">
//                   <div className="flex items-center gap-2">
//                     <Check className="h-5 w-5 text-green-600" />
//                     <div>
//                       <span className="font-medium">{appliedPromo.code}</span> applied! 
//                       <span className="ml-1 text-green-600 font-medium">
//                         {appliedPromo.type === 'percentage' 
//                           ? `(${appliedPromo.discount * 100}% OFF)` 
//                           : `($${appliedPromo.discount} OFF)`}
//                       </span>
//                     </div>
//                   </div>
//                   <button 
//                     onClick={removePromoCode}
//                     className="text-sm text-red-600 hover:text-red-800 underline transition-colors duration-300"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               )}
              
//               {error && (
//                 <div className="p-3 bg-red-100 text-red-700 rounded-md border border-red-200 flex items-center gap-2">
//                   <div className="h-2 w-2 rounded-full bg-red-500"></div>
//                   {error}
//                 </div>
//               )}
//             </div>
            
//             <div className="mt-8 space-y-4">
//               <div className="flex justify-between">
//                 <span className="text-lg">Subtotal</span>
//                 <span className="text-lg">${subtotal.toFixed(2)}</span>
//               </div>
              
//               {appliedPromo && (
//                 <div className="flex justify-between text-green-600">
//                   <span>Discount ({appliedPromo.code})</span>
//                   <span>-${discount.toFixed(2)}</span>
//                 </div>
//               )}
              
//               <div className="flex justify-between font-bold text-lg">
//                 <span>Total</span>
//                 <span>${total.toFixed(2)}</span>
//               </div>
//             </div>
            
//             <div className="mt-6">
//               <Button
//                 onClick={handleInitiatePaypalPayment}
//                 className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
//                 disabled={isPaymentStart || total <= 0}
//               >
//                 {isPaymentStart ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : null}
//                 {isPaymentStart ? "Processing Payment..." : "Checkout with PayPal"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ShoppingCheckout;






import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ChevronDown, ChevronUp, Gift, Sparkles, Copy, Check, Package } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const confettiCanvasRef = useRef(null);

  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [error, setError] = useState('');
  const [showOffers, setShowOffers] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [showCopiedAnimation, setShowCopiedAnimation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationTimestamp, setCelebrationTimestamp] = useState(0);
  const [selectedGift, setSelectedGift] = useState(null);
  const [showGiftSelection, setShowGiftSelection] = useState(false);

  // Enhanced promo codes with minimum purchase requirements
  const availablePromoCodes = {
    'SAVE10': { discount: 0.10, type: 'percentage', minPurchase: 50, description: '10% off on orders above $50' },
    'SAVE20': { discount: 0.20, type: 'percentage', minPurchase: 100, description: '20% off on orders above $100' },
    'SAVE30': { discount: 0.30, type: 'percentage', minPurchase: 150, description: '30% off on orders above $150' },
    'SAVE40': { discount: 0.40, type: 'percentage', minPurchase: 200, description: '40% off on orders above $200' }
  };

  // Available free gifts for orders over $300
  const availableGifts = [
    { id: 1, name: "Wild Craft Bag", value: 15, image: "/images/wildcraft.webp", description: "Lightweight and spacious bag" },
    { id: 2, name: "Boat Airdopes", value: 20, image: "/images/boat.jpg", description: "Wireless earbuds with deep bass." },
    { id: 3, name: "Nike Shoes", value: 18, image: "/images/Nikesh.png", description: "Stylish and durable sports shoes." },
    { id: 4, name: "Fastrack Watch", value: 25, image: "/images/fastrack.webp", description: " Trendy and casual wristwatch" }
  ];

  const calculateSubtotal = () => {
    return cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;
  };

  const applyPromoCode = (code = promoCode) => {
    setError('');
    const promo = availablePromoCodes[code.toUpperCase()];
    const subtotal = calculateSubtotal();
    
    if (!promo) {
      setError('Invalid promo code');
      return;
    }

    if (subtotal < promo.minPurchase) {
      setError(`This code requires a minimum purchase of $${promo.minPurchase}`);
      return;
    }

    setAppliedPromo({
      code: code.toUpperCase(),
      ...promo
    });
    setPromoCode('');
    setShowOffers(false); // Close offers section after applying
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setError('');
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    const subtotal = calculateSubtotal();
    if (appliedPromo.type === 'percentage') {
      return subtotal * appliedPromo.discount;
    } else {
      return appliedPromo.discount;
    }
  };

  const getAvailableOffers = () => {
    const subtotal = calculateSubtotal();
    return Object.entries(availablePromoCodes)
      .filter(([_, promo]) => subtotal >= promo.minPurchase)
      .map(([code, promo]) => ({
        code,
        ...promo
      }));
  };

  const getNextOffer = () => {
    const subtotal = calculateSubtotal();
    const nextOffer = Object.entries(availablePromoCodes)
      .filter(([_, promo]) => subtotal < promo.minPurchase)
      .sort((a, b) => a[1].minPurchase - b[1].minPurchase)[0];
    
    return nextOffer ? { 
      code: nextOffer[0], 
      remaining: nextOffer[1].minPurchase - subtotal,
      ...nextOffer[1] 
    } : null;
  };

  const copyToClipboard = (code) => {
    setPromoCode(code);
    setCopiedCode(code);
    setShowCopiedAnimation(true);
    setTimeout(() => setShowCopiedAnimation(false), 2000);
  };

  const isEligibleForGift = () => {
    return subtotal >= 300;
  };

  const handleSelectGift = (gift) => {
    setSelectedGift(gift);
    setShowGiftSelection(false);
    
    // Trigger celebration animation when gift is selected
    if (!showCelebration) {
      setShowCelebration(true);
      setCelebrationTimestamp(Date.now());
    }
    
    toast({
      title: "Gift Added!",
      description: `${gift.name} has been added to your order for free!`,
      variant: "default",
    });
  };

  // Confetti animation
  useEffect(() => {
    if (showCelebration && confettiCanvasRef.current) {
      const canvas = confettiCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const particles = [];
      const colors = ['#FFC700', '#FF0058', '#2E3191', '#41EAD4', '#FFFFFF'];
      
      // Resize canvas to match parent
      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };
      
      // Create initial particles
      const createParticles = () => {
        for (let i = 0; i < 150; i++) {
          particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: Math.random() * 8 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15 - 3,
            gravity: 0.2,
            opacity: 1,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            rotation: Math.random() * Math.PI * 2
          });
        }
      };
      
      // Animation loop
      let animationId;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          
          // Apply gravity and move
          p.vy += p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.opacity -= 0.01;
          
          // Draw particle
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
        
        // Remove faded particles
        for (let i = particles.length - 1; i >= 0; i--) {
          if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
          }
        }
        
        // Stop animation if no particles left
        if (particles.length === 0) {
          setShowCelebration(false);
          cancelAnimationFrame(animationId);
          return;
        }
        
        animationId = requestAnimationFrame(animate);
      };
      
      // Initialize and start animation
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      createParticles();
      animate();
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationId);
      };
    }
  }, [showCelebration, celebrationTimestamp]);

  useEffect(() => {
    if (appliedPromo && calculateSubtotal() < appliedPromo.minPurchase) {
      removePromoCode();
    }
    
    // Check if cart total has just crossed the $300 threshold
    if (isEligibleForGift() && !showGiftSelection && !selectedGift) {
      setShowGiftSelection(true);
    } else if (!isEligibleForGift()) {
      setSelectedGift(null);
    }
  }, [cartItems]);

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const total = subtotal - discount;
  const availableOffers = getAvailableOffers();
  const nextOffer = getNextOffer();

  function handleInitiatePaypalPayment() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }
  
    // Ensure we have proper number calculations without floating point errors
    // Use Math.round to ensure we're working with exact cents (as integers) to avoid floating point issues
    const currentSubtotal = Math.round(subtotal * 100) / 100;
    const currentDiscount = appliedPromo ? Math.round(discount * 100) / 100 : 0;
    const currentTotal = Math.round((currentSubtotal - currentDiscount) * 100) / 100;
  
    // PayPal requires total to be greater than 0
    if (isNaN(currentTotal) || currentTotal <= 0) {
      toast({
        title: "Invalid total amount",
        description: "The order total must be greater than zero.",
        variant: "destructive",
      });
      return;
    }
  
    // Ensure all cart items have valid prices
    const formattedCartItems = cartItems.items.map((singleCartItem) => {
      const itemPrice = singleCartItem?.salePrice > 0 
        ? Math.round(singleCartItem?.salePrice * 100) / 100
        : Math.round(singleCartItem?.price * 100) / 100;
      
      // Validate that the item has a positive price
      if (isNaN(itemPrice) || itemPrice <= 0) {
        throw new Error(`Invalid price for item: ${singleCartItem?.title}`);
      }
      
      return {
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price: itemPrice,
        quantity: parseInt(singleCartItem?.quantity, 10),
      };
    });
  
    // Create the order data object with properly formatted values
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: formattedCartItems,
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: currentTotal,
      discount: currentDiscount,  
      promoCode: appliedPromo ? appliedPromo.code : null,
      freeGift: selectedGift ? selectedGift.id : null,
      orderDate: new Date().toISOString(),
      orderUpdateDate: new Date().toISOString(),
      paymentId: "",
      payerId: "",
    };
  
    console.log("Sending order data:", JSON.stringify(orderData));
  
    setIsPaymentStart(true);
    
    dispatch(createNewOrder(orderData))
      .then((data) => {
        if (data?.payload?.success) {
          // Payment started successfully, will redirect via approvalURL
          console.log("Order created successfully, waiting for approval URL");
        } else {
          setIsPaymentStart(false);
          // Display error message
          toast({
            title: "Payment Error",
            description: data?.payload?.message || "Failed to create order. Please try again.",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        setIsPaymentStart(false);
        console.error("Order creation error:", error);
        toast({
          title: "Error creating order",
          description: "Please try again later or contact support.",
          variant: "destructive",
        });
      });
  }

  // Redirect to PayPal if approvalURL is available
  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Celebration Canvas */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <canvas 
            ref={confettiCanvasRef} 
            className="w-full h-full" 
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt="Checkout Banner"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Checkout</h1>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Address Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          {/* Order Summary Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items.map((item) => (
                    <UserCartItemsContent key={item.productId} cartItem={item} />
                  ))
                : null}
            </div>
            
            {/* Free Gift Section for orders over $300 */}
            {isEligibleForGift() && (
              <div className="mt-6">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <Gift className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-800">Congratulations! Your order qualifies for a FREE gift!</h3>
                  </div>
                  
                  {selectedGift ? (
                    <div className="flex gap-4 items-center bg-white p-3 rounded-md border border-purple-200">
                      <img 
                        src={selectedGift.image} 
                        alt={selectedGift.name}
                        className="w-16 h-16 object-cover rounded-md" 
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">{selectedGift.name}</h4>
                            <p className="text-sm text-gray-600">{selectedGift.description}</p>
                          </div>
                          <span className="text-green-600 font-medium">FREE</span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm text-gray-500">Value: ${selectedGift.value.toFixed(2)}</span>
                          <button 
                            onClick={() => setShowGiftSelection(true)}
                            className="text-sm text-purple-600 hover:text-purple-800 underline"
                          >
                            Change Gift
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowGiftSelection(true)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors duration-300"
                    >
                      Select Your Free Gift
                    </button>
                  )}
                </div>
                
                {/* Gift Selection Modal */}
                {showGiftSelection && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
                      <div className="p-5 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800">Choose Your Free Gift</h3>
                        <p className="text-sm text-gray-600 mt-1">Select one complimentary gift for your order over $300</p>
                      </div>
                      
                      <div className="p-5 space-y-4">
                        {availableGifts.map(gift => (
                          <div 
                            key={gift.id}
                            className={`p-4 rounded-lg border ${selectedGift && selectedGift.id === gift.id 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'} 
                            transition-all duration-300 cursor-pointer`}
                            onClick={() => handleSelectGift(gift)}
                          >
                            <div className="flex gap-4 items-center">
                              <img 
                                src={gift.image} 
                                alt={gift.name}
                                className="w-20 h-20 object-cover rounded-md" 
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{gift.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{gift.description}</p>
                                <p className="text-sm font-medium text-green-600 mt-2">Value: ${gift.value.toFixed(2)}</p>
                              </div>
                              <div className="h-6 w-6 rounded-full border-2 flex items-center justify-center">
                                {selectedGift && selectedGift.id === gift.id && (
                                  <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
                        <button 
                          onClick={() => setShowGiftSelection(false)}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors duration-300"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            if (selectedGift) {
                              setShowGiftSelection(false);
                            } else {
                              toast({
                                title: "Please select a gift",
                                variant: "default",
                              });
                            }
                          }}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-300"
                        >
                          Confirm Selection
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* $300 Free Gift Progress Bar (shown when under $300) */}
            {!isEligibleForGift() && (
              <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-indigo-600" />
                  <p className="text-sm font-medium text-indigo-800">
                    Add <span className="font-bold">${(300 - subtotal).toFixed(2)}</span> more to receive a FREE gift!
                  </p>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-300 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, (subtotal / 300) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Progress bar to next offer */}
            {nextOffer && (
              <div className="mt-4 bg-amber-50 p-4 rounded-lg border border-amber-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-amber-600" />
                  <p className="text-sm font-medium text-amber-800">
                    Add <span className="font-bold">${nextOffer.remaining.toFixed(2)}</span> more to unlock {nextOffer.description}
                  </p>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, (subtotal / nextOffer.minPurchase) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Available Offers Section */}
            <div className="mt-6">
              <button
                onClick={() => setShowOffers(!showOffers)}
                className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-700">
                    {availableOffers.length > 0 
                      ? `${availableOffers.length} Offer${availableOffers.length > 1 ? 's' : ''} Available!` 
                      : 'Special Offers'}
                  </span>
                </div>
                {showOffers ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-blue-600" />}
              </button>
              
              {showOffers && (
                <div className="mt-3 max-h-52 overflow-y-auto pr-1 transition-all duration-300 ease-in-out">
                  <div className="space-y-3">
                    {availableOffers.length > 0 ? (
                      availableOffers.map((offer) => (
                        <div 
                          key={offer.code} 
                          className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex gap-2 items-center">
                                <span className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-sm">{offer.code}</span>
                                <span className="font-medium text-blue-800">
                                  {offer.type === 'percentage' 
                                    ? `${offer.discount * 100}% OFF` 
                                    : `$${offer.discount} OFF`}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                            </div>
                            <button 
                              onClick={() => copyToClipboard(offer.code)}
                              className="p-2 rounded-full bg-white hover:bg-blue-200 border border-blue-300 transition-colors duration-300"
                            >
                              {copiedCode === offer.code && showCopiedAnimation 
                                ? <Check className="h-4 w-4 text-green-600" /> 
                                : <Copy className="h-4 w-4 text-blue-600" />}
                            </button>
                          </div>
                          <div className="mt-2">
                            <button 
                              onClick={() => applyPromoCode(offer.code)}
                              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-300"
                            >
                              Apply Code
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <p className="text-gray-600 mb-2">
                          Shop more to unlock special offers!
                        </p>
                        <div className="mt-2 bg-white p-3 rounded-md border border-gray-200">
                          <p className="text-sm font-medium text-gray-800">First offer available at $50</p>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                            <div 
                              className="h-full bg-gradient-to-r from-gray-400 to-blue-500 transition-all duration-500 ease-out"
                              style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Promo code section */}
            <div className="mt-6 space-y-4">
              {!appliedPromo ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button 
                    onClick={() => applyPromoCode()}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center p-3 bg-green-100 text-green-700 rounded-md border border-green-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <div>
                      <span className="font-medium">{appliedPromo.code}</span> applied! 
                      <span className="ml-1 text-green-600 font-medium">
                        {appliedPromo.type === 'percentage' 
                          ? `(${appliedPromo.discount * 100}% OFF)` 
                          : `($${appliedPromo.discount} OFF)`}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={removePromoCode}
                    className="text-sm text-red-600 hover:text-red-800 underline transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              )}
              
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md border border-red-200 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  {error}
                </div>
              )}
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex justify-between">
                <span className="text-lg">Subtotal</span>
                <span className="text-lg">${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedPromo && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedPromo.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={handleInitiatePaypalPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                disabled={isPaymentStart || total <= 0}
              >
                {isPaymentStart ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPaymentStart ? "Processing Payment..." : "Checkout with PayPal"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
