




import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ChevronDown, ChevronUp, Gift, Sparkles, Copy, Check } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [error, setError] = useState('');
  const [showOffers, setShowOffers] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [showCopiedAnimation, setShowCopiedAnimation] = useState(false);

  // Enhanced promo codes with minimum purchase requirements
  const availablePromoCodes = {
    'SAVE10': { discount: 0.10, type: 'percentage', minPurchase: 50, description: '10% off on orders above $50' },
    'SAVE20': { discount: 0.20, type: 'percentage', minPurchase: 100, description: '20% off on orders above $100' },
    'SAVE30': { discount: 0.30, type: 'percentage', minPurchase: 150, description: '30% off on orders above $150' },
    'SAVE40': { discount: 0.40, type: 'percentage', minPurchase: 200, description: '40% off on orders above $200' }
  };

  const calculateSubtotal = () => {
    return cartItems && cartItems.length > 0
      ? cartItems.reduce(
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

  useEffect(() => {
    if (appliedPromo && calculateSubtotal() < appliedPromo.minPurchase) {
      removePromoCode();
    }
  }, [cartItems]);

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const total = subtotal - discount;
  const availableOffers = getAvailableOffers();
  const nextOffer = getNextOffer();

  return (
    <SheetContent className="sm:max-w-md flex flex-col h-full">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      
      {/* Scrollable cart items area */}
      <div className="flex-1 overflow-y-auto mt-8 pr-2">
        <div className="space-y-4">
          {cartItems && cartItems.length > 0
            ? cartItems.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : null}
        </div>
      </div>
      
      {/* Progress bar to next offer */}
      {nextOffer && (
        <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-200 shadow-sm">
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

      {/* Fixed checkout section */}
      <div className="mt-auto pt-6 border-t sticky bottom-0 bg-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
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
          
          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-6 text-lg"
          >
            Checkout
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;











