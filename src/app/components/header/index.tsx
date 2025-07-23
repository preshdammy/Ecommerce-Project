"use client";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import timeShoppyLogo from "../../../../public/figma images/Time-shoppy.png";
import searchLogo from "../../../../public/figma images/search.png";
import chevronDown from "../../../../public/figma images/chevron-down.png";
import chevronRight from "../../../../public/figma images/chevron-right.png";
import variant3 from "../../../../public/figma images/Variant3.png";
import bell from "../../../../public/figma images/bell.png";
import heart from "../../../../public/figma images/heart.png";
import shopping_cart from "../../../../public/figma images/shopping-cart.png";
import frame from "../../../../public/figma images/Frame 164.png";
import { GoBell } from "react-icons/go";
import { FaCaretDown } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useState } from "react";
import { div } from "framer-motion/client";





import cancel from '../../../../public/figma images/x-01.png'
import cart from '../../../../public/figma images/shopping-cart (2).png'
import shirt from '../../../../public/figma images/ryan-hoffman-6Nub980bI3I-unsplash-removebg-preview 1.png'
import trash from '../../../../public/figma images/Icon.png'
import substract from '../../../../public/figma images/Icon (1).png'
import add from '../../../../public/figma images/add-square-02.png'
import { IoIosAddCircle } from "react-icons/io";
import { GrSubtractCircle } from "react-icons/gr";





import like from '../../../../public/figma images/heart (1).png'
import cancel2 from '../../../../public/figma images/Icon (2).png'

import { useReactiveVar } from "@apollo/client";
import { cartItemsVar } from "@/shared/lib/apolloClient";
import { likedItemsVar } from "@/shared/lib/apolloClient";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { string } from "zod";



const Header = () => {
  const [isAuthentication, setIsAuthentication] = useState<boolean>(false);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showLike, setShowLike] = useState<boolean>(false);
  const [counts, setCounts] = useState<{ [productId: string]: number }>({});
  const cartItems = useReactiveVar(cartItemsVar);
  const likedItems = useReactiveVar(likedItemsVar);
  const pathname = usePathname();
  const [showUsername, setShowUsername] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const Router = useRouter()
  
  
  interface Product {
    id: string;
    name: string;
    price: number;
  }

  const isHomeActive = () => {
    return pathname === "/" || pathname === "/user" || pathname === "/vendor";
  };


  const handleDelete = (product: Product): void => {
    cartItemsVar(cartItemsVar().filter((item: Product) => item.id !== product.id));
  }

  const handleCheckout = () => {
    Router.push("/user/checkout-page")
    setShowCart(false)
    setShowLike(false)
  }

  useEffect(() => {
    if (pathname.startsWith("/user")) {
      setIsAuthentication(true);
      setShowUsername(true);
  
      const cookieUser = Cookies.get("userinfo");
      if (cookieUser) {
        try {
          const parsedUser = JSON.parse(cookieUser);
          setUserName(parsedUser.name || "User");
        } catch (err) {
          console.error("Failed to parse user info from cookies", err);
        }
      } else {
        setUserName(null);
      }
  
    } else if (pathname.startsWith("/vendor")) {
      setIsAuthentication(true);
      setShowUsername(true);
  
      const cookieVendor = Cookies.get("vendorinfo");
      if (cookieVendor) {
        try {
          const parsedVendor = JSON.parse(cookieVendor);
          setUserName(parsedVendor.name || "Vendor");
        } catch (err) {
          console.error("Failed to parse vendor info from cookies", err);
        }
      } else {
        setUserName(null);
      }
  
    } else {
      setIsAuthentication(false);
      setShowUsername(false);
    }
  }, [pathname]);
  



  return (
    <>
      <div className="max-w-[1536px] mx-auto font-sans">
        <div className="w-full bg-blue-500 lg:hidden">
          <div className="md:h-[75px] w-[85%] h-[25px] text-[8px] gap-[16px] flex mx-auto sm:text-[16px] sm:h-[60px] md:text-[20px] items-center sm:gap-[6%] text-white ">
            <Link  href="/" className={`relative ${isHomeActive() ? "text-[#272222] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#272222]" : ""}`}>Home</Link>
            <Link href="">About Us</Link>
            <Link href="">Contact Us</Link>
            <Link href="">Help</Link>
          </div>
        </div>

        <div className=" lg:h-[128px] md:h-[100px] sm:h-[90px]  flex w-full items-center ">
          <div className=" flex w-[85%] mx-auto h-[64px] justify-between items-center ">
            <Image
              className=" lg:w-[218px] md:w-[200px] sm:w-[180px] w-[104px] h-[26px] sm:h-[40px] md:h-[50px] lg:h-[55px]"
              src={timeShoppyLogo}
              alt=""
            />

            <div className="h-[64px] w-[40%] pr-[10px] hidden items-center border-[1px] lg:flex  justify-around rounded-[16px] border-[#007BFF]">
              <Image
                className="w-[32px] ml-[20px]  h-[32px]"
                src={searchLogo}
                alt=""
              />
              <input
                type="text"
                className="w-[52%] ml-[10px] h-[60%] outline-0 placeholder:text-[20px] placeholder:font-sans placeholder:font-[300] mr-[20px]"
                placeholder="Search for anything"
              />
              <div className="flex items-center gap-[16px] w-[120px] h-[48px] border-l-[1px] border-black justify-end ">
                {" "}
                <span className="text-[20px] text-[#007BFF]">State</span>{" "}
                <Image className="w-[24px] h-[24px]" src={chevronDown} alt="" />{" "}
              </div>
            </div>

            
              <button className="w-[20%] lg:flex h-[64px] rounded-[16px] hidden bg-[#FF4C3B] justify-center gap-[16px] text-white items-center">
                <span>Become a Seller </span>
                <Image
                  className="w-[24px] h-[24px]"
                  src={chevronRight}
                  alt=""
                />
              </button>
            

            <div className=" flex items-center sm:gap-[40px] gap-[30px] lg:gap-[50px] lg:hidden text-blue-500">
            <Link
                href="/user/cart"
                className="relative md:text-[28px] sm:text-[24px] text-[16px]"
              >
                <FiShoppingCart />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] sm:text-[10px] md:text-[12px] font-bold rounded-full px-1.5 sm:px-2">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <Link
                href=""
                className="md:text-[28px] sm:text-[24px] text-[16px]"
              >
                <RxHamburgerMenu />
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto w-[85%] lg:hidden block">
          <div className="mx-auto w-[100%] sm:w-[90%]">
            <div className="md:h-[55px] pr-[10px] h-[35px] sm:h-[45px] items-center border-[1px] flex  justify-around rounded-[40px] sm:rounded-[16px] border-[#007BFF]">
              <Image
                className="md:w-[26px] sm:w-[22px] w-[16px] ml-[20px]  md:h-[26px] sm:h-[22px] h-[16px]"
                src={searchLogo}
                alt=""
              />
              <input
                type="text"
                className="w-[52%] ml-[10px] sm:pb-[0px] pb-[5px] h-[60%] outline-0 placeholder:sm:text-[14px] placeholder:md:text-[18px] placeholder:text-[10px] placeholder:font-sans placeholder:font-[300] mr-[20px]"
                placeholder="Search for anything"
              />
              <div className="flex items-center gap-[6px] sm:gap-[16px] w-[120px] h-[60%] sm:h-[80%] sm:mr-[5px] mr-[15px] border-l-[1px] border-gray-400 ">
                {" "}
                <span className="md:text-[18px] ml-[20%] sm:text-[16px] text-[12px] text-[#007BFF]">
                  State
                </span>{" "}
                <Image
                  className="md:w-[22px] sm:w-[18px] w-[14px] h-[14px] sm:h-[18px] md:h-[22px]"
                  src={chevronDown}
                  alt=""
                />{" "}
              </div>
            </div>
          </div>
        </div>


        {showLike && (
  <div className='w-[552px] absolute right-[5px] top-[0px] h-screen bg-white flex-col z-12 p-[20px] hidden sm:hidden lg:flex'>
    <div className='ml-auto'>
      <button onClick={() => setShowLike(false)}>
        <Image src={cancel} alt='' />
      </button>
    </div>

    <div className='flex items-center my-[10px] gap-[15px]'>
      <Image src={like} className='w-[27px] h-[27px]' alt='' />
      <p className='text-[24px] font-[600]'>{likedItems.length} items</p>
    </div>

    <div className='overflow-y-scroll flex-1'>
      {likedItems.length === 0 ? (
        <p className='text-center text-[18px] text-gray-500 mt-[100px]'>You haven't liked any items yet.</p>
      ) : (
        likedItems.map((item, index) => (
          <div
            key={index}
            className='flex justify-between py-[20px] items-center gap-[20px] border-t-[1px] border-t-[#f8f8f8] border-b-[1px] border-b-[#f8f8f8]'
          >
            <div className='flex items-center'>
              <Image
                onClick={() =>
                  likedItemsVar(likedItems.filter((liked) => liked.id !== item.id))
                }
                src={cancel2}
                className='cursor-pointer'
                alt=''
              />
            </div>

            <Image src={item.image || shirt} alt='' width={60} height={60} />

            <div className='flex flex-col'>
              <p className='text-[16px] font-[600] pr-[190px] leading-[20px]'>{item.name}</p>
              <p className='text-[16px] text-[#007bff] font-[600] mt-[4px]'>₦ {item.price.toLocaleString()}</p>
            </div>

            <Image
              onClick={() => {
                const alreadyInCart = cartItems.find((c) => c.id === item.id);
                if (!alreadyInCart) cartItemsVar([...cartItems, item,]);
              }}
              src={cart}
              alt=''
              className='cursor-pointer'
            />
          </div>
        ))
      )}
    </div>

    {likedItems.length > 0 && (
      <div className='mx-auto mt-auto'>
        <button onClick={handleCheckout} className='text-[16px] px-4 py-2 cursor-pointer hover:bg-amber-700 text-white bg-[#ff4c3b] font-[700]'>
          Checkout Now (₦{" "}
          {likedItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()})
        </button>
      </div>
    )}
  </div>
)}

{showCart && (
  <div className='w-[552px] absolute right-[5px] top-[0px] h-screen bg-white flex-col z-12 p-[20px] hidden sm:hidden lg:flex'>
    <div className='ml-auto'>
      <button onClick={() => setShowCart(false)}>
        <Image src={cancel} alt='' />
      </button>
    </div>

    <div className='flex items-center my-[10px] gap-[15px]'>
      <Image src={cart} className='w-[30px] h-[27px]' alt='' />
      <p className='text-[24px] font-[600]'>{cartItems.length} items</p>
    </div>

    <div className='overflow-y-scroll flex-1'>
      {cartItems.length === 0 ? (
        <p className='text-center text-[18px] text-gray-500 mt-[100px]'>Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => {
          const quantity = counts[item.id] || 1;
          const totalPrice = item.price * quantity;

          return (
            <div key={index} className='flex justify-between py-[20px] items-center gap-[20px] border-t-[1px] border-t-[#f8f8f8] border-b-[1px] border-b-[#f8f8f8]'>
              <div className='flex flex-col items-center'>
                <IoIosAddCircle
                  onClick={() =>
                    setCounts((prev) => ({
                      ...prev,
                      [item.id]: (prev[item.id] || 1) + 1,
                    }))
                  }
                  className='w-[25px] h-[25px] hover:text-[#00bfff] cursor-pointer'
                />
                <p className='text-[24px] font-[600]'>{quantity}</p>
                <GrSubtractCircle
                  onClick={() =>
                    setCounts((prev) => ({
                      ...prev,
                      [item.id]: Math.max(1, quantity - 1),
                    }))
                  }
                  className='w-[25px] h-[25px] hover:text-[#00bfff] cursor-pointer'
                />
              </div>

              <Image src={item.image || shirt} alt='' />

              <div className='flex flex-col'>
                <p className='text-[16px] font-[600] pr-[190px] leading-[20px]'>{item.name}</p>
                <p className='text-[16px] text-[#939090] font-[600] mt-[6px]'>
                  ₦ {item.price.toLocaleString()} * {quantity}
                </p>
                <p className='text-[16px] text-[#007bff] font-[600] mt-[4px]'>
                  ₦ {totalPrice.toLocaleString()}
                </p>
              </div>

              <Image onClick={() => handleDelete(item)} src={trash} alt='' className='cursor-pointer' />
            </div>
          );
        })
      )}
    </div>

    {cartItems.length > 0 && (
      <div className='mx-auto mt-auto'>
        <button onClick={handleCheckout} className='text-[16px] px-4 py-2 cursor-pointer hover:bg-amber-700 text-white bg-[#ff4c3b] font-[700]'>
          Checkout Now (₦{" "}
          {cartItems
            .reduce((sum, item) => {
              const quantity = counts[item.id] || 1;
              return sum + item.price * quantity;
            }, 0)
            .toLocaleString()}
          )
        </button>
      </div>
    )}
  </div>
)}




          <div className=" w-full h-[87px] bg-[#007BFF] lg:block hidden">
            <div className="w-[85%] h-[100%] mx-auto flex items-center justify-between">
              <div className=" h-[100%] flex items-end">
                <div className="w-[255px] h-[72px] bg-white rounded-t-[16px] flex gap-[16px] justify-center items-center">
                  <div className="flex items-center gap-[8px]">
                    <Image
                      className="w-[24px] h-[24px]"
                      src={variant3}
                      alt=""
                    />
                    <span className="text-[20px] font-sans">
                      All Categories
                    </span>
                  </div>

                  <button>
                    <Image
                      className="w-[24px] h-[24px]"
                      src={chevronDown}
                      alt=""
                    />
                  </button>
                </div>
              </div>
              <div className="flex w-[642px] font-sans font-[600] text-white text-[20px]  justify-around items-center">
                <Link href="/" className={`relative ${isHomeActive() ? "text-[#272222] font-[600] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#272222]" : ""}`}> Home</Link>
                <Link href="">Best Selling</Link>
                <Link href=""> Products</Link>
                <Link href=""> Events</Link>
                <Link href=""> FAQ</Link>
              </div>
              
                <MenuIcon isAuthentication={isAuthentication} setShowCart={setShowCart} setShowLike={setShowLike}/>
              
            </div>
          </div>
       

        <div
          className={`w-full lg:flex hidden h-[46px] ${
            isAuthentication ? "bg-[#ffffff]" : "bg-white"
          }`}
        >
          <div className="flex w-[85%] justify-center h-[100%] items-center mx-auto">
          {isAuthentication && showUsername ? (
              <button className="font-[700] text-[12px] font-sans text-black">
                {`Welcome back ${userName || "User"}!`}
              </button>
            ) : !isAuthentication ? (
              <button className="font-[700] text-[12px] font-sans text-[#272222]">
                Create an account to continue shopping!
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

export const MenuIcon = ({ isAuthentication, setShowCart, setShowLike}: {isAuthentication: boolean,  setShowCart: Dispatch<SetStateAction<boolean>>, setShowLike: Dispatch<SetStateAction<boolean>>;}) => {
  const cartItems = useReactiveVar(cartItemsVar);
  const likedItems = useReactiveVar(likedItemsVar);
  return (
    <>
      <div
        className={`flex w-[220px]  justify-between ${
          isAuthentication ? "text-white" : "text-white"
        } `}
      >
        <Link href="" className="text-[32px]">
          {" "}
          <GoBell />{" "}
        </Link>
          <div className="relative text-[32px]">
            <Link href="" onClick={() => setShowLike(true)}>
              <FaRegHeart />
              {likedItems.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center">
                  {likedItems.length}
                </span>
              )}
            </Link>
          </div>

      <div className="relative text-[32px]">
        <Link href="" onClick={() => setShowCart(true)}>
          <FiShoppingCart />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>

        <Link href="" className="text-[32px] flex gap-[1px] items-end">
          {" "}
          <MdOutlineAccountCircle />{" "}
          <span className="text-[18px] -ml-[5px]">
            <FaCaretDown />
          </span>
        </Link>
      </div>
    </>
  );
};