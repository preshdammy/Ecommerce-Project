import Image from "next/image";
import camera from "../../../../public/figma images/camera.png";

export default function PersonalDetailsForm() {
  return (
    <div className=" flex flex-col items-center justify-start w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-0 min-h-screen">
      {/* Avatar Section */}
      <div className="relative">
        {/* outer ring */}
        <div className="w-32 h-32 rounded-full border-1 border-[#939090] flex items-center justify-center">
          {/* inner colored circle */}
          <div className="relative w-28 h-28 rounded-full bg-[white] border-1 border-[#939090] overflow-hidden">
            <Image
              src="/profilepic.png"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
        </div>
        {/* camera button */}
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-white rounded-full p-2  cursor-pointer"
        >
          <Image
            src={camera}
            alt="Upload avatar"
            width={30}
            height={30}
          />
        </label>
        <input id="avatar-upload" type="file" className="hidden" />
      </div>


      {/* Form Section */}
      <form className="mt-6 w-full space-y-4 flex flex-col bg-none">
        <input className="w-full p-3 border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 rounded-lg placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px] bg-white " placeholder="Full Name"  />
        <input className="w-full p-3 border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 rounded-lg bg-white placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]" placeholder="Email" />
        <input className="w-full p-3 border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 rounded-lg bg-white placeholder:text-[16px] placeholder:text-[#272222] placeholder:tracking-[1px]" placeholder="Address" />

        {/* Responsive Dropdown Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select className="p-3 border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 rounded-lg bg-white w-full sm:w-1/2 text-[16px] text-[#272222] tracking-[1px]">
            <option disabled selected>Select State</option>
            <option>Lagos</option>
            <option>Ibadan</option>
            <option>Kano</option>
            <option>Rivers</option>
          </select>
          <select className="p-3 border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 rounded-lg bg-white w-full sm:w-1/2 text-[16px] text-[#272222] tracking-[1px]">
            <option disabled selected>Select City</option>
            <option>Ikeja</option>
            <option>Abuja</option>
            <option>Paris</option>
            <option>London</option>
          </select>
        </div>

        <input type="date" className="w-full p-3 border-2 border-[#D4D3D3] focus:outline-none focus:ring-0 focus:border-blue-600 rounded-lg bg-white text-[16px] text-[#272222] tracking-[1px]" />

        {/* Gender */}
        <div className="flex items-center gap-4 justify-center">
          <span className="text-sm text-gray-700">Gender:</span>
          <label className="flex items-center gap-1">
            <input type="radio" name="gender" />
            <span className="text-17px text-[#272222] tracking-[1px]">Female</span>
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="gender" defaultChecked />
            <span className="text-17px text-[#272222] tracking-[1px]">Male</span>
          </label>
        </div>

        {/* Submit Button */}
        <button className="bg-[#FF4C3B] hover:bg-red-600 transition text-white px-6 py-3 rounded-2xl w-1/2 sm:w-1/2 self-center">
          Update
        </button>
      </form>
    </div>
  );
}
