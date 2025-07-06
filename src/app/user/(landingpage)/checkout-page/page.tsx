"use client";

import React, { useState } from "react";
const steps = ["Shipping", "Payment", "Success"];
export default function CheckoutSteps() {
const [currentStep, setCurrentStep] = useState(0);
return (

<div className="bg-[#fbfbfb]">

<div className="w-full max-w-3xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
<div className="relative flex items-center justify-between mb-6 sm:mb-8 md:mb-10 lg:mb-12">
<div className="absolute top-1/2 left-0 right-0 h-1 bg-[#f3f1f1] z-0 transform -translate-y-1/2" />
<div
className="absolute top-1/2 left-0 h-1 bg-black z-0 transform -translate-y-1/2"
style={{
width:
currentStep === 0

? "0%"

: currentStep === 1

? "50%"

: "100%",

transition: "width 0.3s ease-in-out",
}}
/>











{steps.map((label, index) => {

const isActive = index <= currentStep;

return (

<div key={label} className="relative z-5">

<div

className={`

text-[10px] sm:text-xs md:text-sm lg:text-base

px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5

rounded-full transition-colors duration-300

font-[400]

${isActive ? "bg-[#272222] text-white font-[600]" : "bg-[#f3f1f1] text-black border-gray-400"}

`}

>

{index + 1}. {label}

</div>

</div>

);

})}

</div>








<div className="bg-white h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] p-3 sm:p-4 md:p-6 lg:p-8">

{currentStep === 0 && <p>This is the Shipping page content.</p>}

{currentStep === 1 && <p>This is the Payment page content.</p>}

{currentStep === 2 && <p>This is the Success confirmation screen.</p>}

</div>






<div className="flex justify-between mt-6">

<button

className="px-2 sm:px-3 py-1.5 sm:py-2 border rounded text-xs sm:text-sm md:text-base disabled:opacity-40"

onClick={() => setCurrentStep((prev) => prev - 1)}

disabled={currentStep === 0}

>

Back

</button>

<button

className="px-2 sm:px-3 py-1.5 sm:py-2 bg-black text-white rounded text-xs sm:text-sm md:text-base disabled:opacity-40"

onClick={() => setCurrentStep((prev) => prev + 1)}

disabled={currentStep === steps.length - 1}

>

Next

</button>

</div>

</div>

</div>

);

}
