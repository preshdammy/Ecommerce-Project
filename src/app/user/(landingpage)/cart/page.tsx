"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useReactiveVar } from "@apollo/client";
import { cartItemsVar } from "@/shared/lib/apolloClient"; // Your makeVar for cart items
import { useRouter } from "next/navigation";

import cartpic from "../../../../../public/figma images/🦆 icon _image outline_ (1).png";
import chevleft from "../../../../../public/figma images/chevron-left.png";

const Cart = () => {
  const [show, setShow] = useState(false);
  const cartItems = useReactiveVar(cartItemsVar);
  const [counts, setCounts] = useState<{ [productId: string]: number }>({});
  const router = useRouter();

  
  const subtotal = cartItems.reduce((sum, item) => {
    const qty = counts[item.id] || 1;
    return sum + item.price * qty;
  }, 0);

  const timeshoppyCredits = 500; // Example fixed credit
  const total = subtotal + timeshoppyCredits;

  const handleCheckout = () => {
    setShow(false);
    router.push("/user/checkout-page");
  };

  const handleRemove = (id: string) => {
    cartItemsVar(cartItems.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="flex flex-col gap-[30px] lg:px-[50px] py-[50px] bg-[#fbfbfb] sm:px-[25px] px-[20px] md:px-[35px] xl:px-[60px]">
        <div className="lg:text-[40px] font-normal text-[#007bff] sm:text-[24px] text-[24px] md:text-[32px] xl:text-[40px]">
          <h2>My Cart</h2>
        </div>

        <div className="mb-[40px] flex flex-col gap-[20px]">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => {
              const qty = counts[item.id] || 1;
              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white rounded-[16px] w-full lg:p-[30px] sm:p-[15px] p-[15px] md:p-[20px] xl:p-[30px]"
                >
                  <div className="flex gap-[20px] items-center">
                    <div>
                      <Image
                        className="lg:w-[70px] lg:h-[60px] sm:w-[64px] sm:h-[56px] w-[64px] h-[56px] md:w-[68px] md:h-[58px] xl:w-[70px] xl:h-[60px]"
                        src={item.image || cartpic}
                        alt={item.name}
                        width={70}
                        height={60}
                      />
                    </div>
                    <div className="flex flex-col lg:w-[80%] sm:w-[60%] w-[60%] md:w-[70%] xl:w-[80%]">
                      <h4 className="text-[#272222] lg:text-[20px] lg:font-normal sm:text-[12px] sm:font-[500] text-[12px] font-[500] md:text-[20px] md:font-[500] xl:text-[20px] xl:font-normal">
                        {item.name}
                      </h4>
                      <div className="flex gap-3 items-center mt-2">
                        <button
                          onClick={() =>
                            setCounts((prev) => ({
                              ...prev,
                              [item.id]: Math.max(1, qty - 1),
                            }))
                          }
                          className="bg-gray-200 px-2 rounded"
                        >
                          -
                        </button>
                        <span>{qty}</span>
                        <button
                          onClick={() =>
                            setCounts((prev) => ({
                              ...prev,
                              [item.id]: qty + 1,
                            }))
                          }
                          className="bg-gray-200 px-2 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-[50%] sm:gap-[20px] gap-[20px] items-end md:gap-[15px] xl:gap-[20px]">
                    <h4 className="text-[#272222] lg:text-[20px] font-bold sm:text-[10px] text-[10px] md:text-[20px] xl:text-[20px]">
                      ₦ {(item.price * qty).toLocaleString()}
                    </h4>
                    <button
                      className="text-[#ff4c3b] lg:text-[16px] font-normal sm:text-[10px] text-[10px] md:text-[16px] xl:text-[16px]"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove from cart
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom buttons for small and medium screens */}
        {cartItems.length > 0 && (
          <div className="mb-[80px] flex justify-between items-center lg:hidden md:hidden xl:hidden">
            <button onClick={()=>router.push("/user/landingpage")} className="border-[1px] border-[#ff4c3b] bg-[#fbfbfb] rounded-[100px] px-4 py-3 text-[12px] font-[500] md:text-[14px]">
              Return to Shopping
            </button>
            <button
              onClick={() => setShow(true)}
              className="bg-[#ff4c3b] rounded-[100px] px-4 py-3 text-white text-[12px] font-[600] md:text-[14px]"
            >
              Checkout
            </button>
          </div>
        )}

        {/* Checkout Modal for small screens */}
        {show && (
          <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[999]">
            <div className="flex m-auto flex-col bg-[#ffffff] w-[80%] p-[25px] rounded-[16px] gap-[20px] md:w-[70%]">
              <div className="flex items-center">
                <button onClick={() => setShow(false)}>
                  <Image src={chevleft} alt="" />
                </button>
                <h1 className="m-auto text-[#55a7ff] text-[24px] font-normal md:text-[28px]">
                  Checkout
                </h1>
              </div>
              <div>
                <input
                  className="bg-[#fbfbfb] p-[20px] outline-none border-none rounded-[8px] w-full placeholder:text-[12px] placeholder:font-normal placeholder:text-[#918b93] md:placeholder:text-[14px]"
                  placeholder="Name your order"
                  type="text"
                />
              </div>
              <div className="flex justify-between mt-[40px] px-[20px]">
                <p className="text-[#918b93] text-[12px] font-normal md:text-[14px]">
                  Subtotal
                </p>
                <p className="text-black text-[12px] font-[600] md:text-[14px]">
                  ₦ {subtotal.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between px-[20px]">
                <p className="text-[#918b93] text-[12px] font-normal md:text-[14px]">
                  Time Shoppy credits
                </p>
                <p className="text-black text-[12px] font-[600] md:text-[14px]">
                  ₦ {timeshoppyCredits}
                </p>
              </div>
              <div className="flex justify-between border-t-[1px] border-[rgba(0,0,0,0.1)] pt-[10px]">
                <p className="text-[#918b93] text-[12px] font-normal px-[20px] md:text-[14px]">
                  Total
                </p>
                <p className="text-black text-[12px] font-[600] px-[20px] md:text-[14px]">
                  ₦ {total.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleCheckout}
                  className="text-[12px] font-[600] bg-[#ff4c3b] text-white border-none rounded-[100px] px-10 py-4 mt-[80px] md:text-[14px] xl:text-[16px]"
                >
                  Make Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Large screen checkout summary */}
        {cartItems.length > 0 && (
          <div className="ml-auto flex-col bg-[#ffffff] w-[50%] p-[25px] rounded-[16px] gap-[40px] mb-[260px] sm:hidden hidden lg:flex md:flex xl:flex md:w-[50%] xl:w-[40%]">
            <div>
              <input
                className="bg-[#fbfbfb] p-[20px] outline-none border-none rounded-[8px] w-full placeholder:text-[20px] placeholder:font-normal placeholder:text-[#918b93] md:placeholder:text-[20px] xl:placeholder:text-[20px]"
                placeholder="Name your order"
                type="text"
              />
            </div>
            <div className="flex justify-between mt-[40px] px-[20px]">
              <p className="text-[#918b93] text-[20px] font-normal md:text-[20px] xl:text-[20px]">
                Subtotal
              </p>
              <p className="text-black text-[20px] font-bold md:text-[20px] xl:text-[20px]">
                ₦ {subtotal.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between px-[20px]">
              <p className="text-[#918b93] text-[20px] font-normal md:text-[20px] xl:text-[20px]">
                Time Shoppy credits
              </p>
              <p className="text-black text-[20px] font-bold md:text-[20px] xl:text-[20px]">
                ₦ {timeshoppyCredits}
              </p>
            </div>
            <div className="flex justify-between border-t-[1px] border-[rgba(0,0,0,0.1)] pt-[10px]">
              <p className="text-[#918b93] text-[20px] font-normal px-[20px] md:text-[20px] xl:text-[20px]">
                Total
              </p>
              <p className="text-black text-[20px] font-bold px-[20px] md:text-[20px] xl:text-[20px]">
                ₦ {total.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleCheckout}
                className="text-[24px] bg-[#ff4c3b] text-white border-none rounded-[100px] px-10 py-4 mt-[80px] md:text-[20px] xl:text-[24px]"
              >
                Make Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
