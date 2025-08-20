"use client"

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";

type FAQItemProps = {
  faq: {
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onClick: () => void;
};

const AccordionItem = ({ faq, isOpen, onClick }: FAQItemProps) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onClick}
      className="w-full text-left py-3 sm:py-4 h-auto sm:h-[85px] md:h-[100px] lg:h-[115px] bg-[#F5FAFF] px-3 sm:px-4 flex justify-between items-center"
    >
      <span className="font-normal text-[14px] sm:text-[14px] md:text-[16px] lg:text-[20px] xl:text-[24px] font-sans">
        {faq.question}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <FaAngleDown className="text-lg sm:text-xl md:text-2xl lg:text-[24px]" />
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="px-3 sm:px-4 pb-3 sm:pb-4 my-2 sm:my-[10px] text-sm sm:text-base md:text-lg lg:text-xl xl:text-[20px] overflow-hidden"
        >
          {faq.answer}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const faqData = [
    {
      question: "What is Time Shoppy?",
      answer:
        "Time Shoppy is an online marketplace that connects sellers and buyers, offering a wide range of products with fast and reliable delivery.",
    },
    {
      question: "How much does it cost to upload products for sale?",
      answer:
        "Uploading products is completely free. However, a small commission is charged only when a sale is successfully completed.",
    },
    {
      question: "What happens if a delivery is not made on time?",
      answer:
        "If a delivery is delayed, Time Shoppy will notify the buyer and offer compensation in the form of coupons or partial refunds depending on the situation.",
    },
    {
      question: "How many days does it take for an order to be delivered?",
      answer:
        "Orders are typically delivered within 3–5 business days. Delivery times may vary depending on the buyer's location and the product type.",
    },
    {
      question: "How many days does it take for an order to be delievered?",
      answer:
        "Delivery usually takes 3–5 business days, but high-demand periods may extend it slightly. Real-time tracking is available for every order.",
    },
    {
      question: "How many days does it take for an order to be delievered?",
      answer:
        "Standard delivery is 3–5 days, while express shipping options are available at checkout for faster delivery.",
    },
    {
      question: "How many days does it take for an order to be delievered?",
      answer:
        "We aim to deliver within 3 to 5 working days. You'll get updates via email and SMS as your package moves.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-[1536px] mx-auto px-8">
      <div className="w-full sm:w-[90%] md:w-[85%] mx-auto my-6 sm:my-8 md:my-10 lg:my-[40px]">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-center font-sans text-[#55A7FF]">
          Frequently Asked Questions
        </h2>

        <div className="w-full sm:w-[90%] md:w-[85%] mx-auto mt-4 sm:mt-6 md:mt-8 flex flex-col gap-4 bg-white rounded-lg sm:rounded-lg md:rounded-xl">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;