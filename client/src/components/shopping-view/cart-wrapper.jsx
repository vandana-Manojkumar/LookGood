import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setCartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  
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

  // Function to handle quantity increment
  const incrementQuantity = (productId) => {
    const updatedItems = cartItems.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const subtotal = calculateSubtotal();

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
                <UserCartItemsContent 
                  key={item.productId} 
                  cartItem={item} 
                  incrementQuantity={incrementQuantity}
                />
              ))
            : null}
        </div>
      </div>
      
      {/* Fixed checkout section */}
      <div className="mt-auto pt-6 border-t sticky bottom-0 bg-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
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