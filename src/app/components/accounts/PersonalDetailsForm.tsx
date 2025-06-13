import avatar from "../../../../public/avatar.jpg";
import Image from "next/image";

export default function PersonalDetailsForm() {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 pt-4 sm:px-6 lg:px-0 h-[90vh]">
      {/* Avatar Section */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border border-[#4b4949] overflow-hidden">
        <Image
          src={avatar}
          alt="User Avatar"
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
        <div className="absolute bottom-0 right-0">
          <input type="file" className="hidden" id="avatar-upload" />
          <label htmlFor="avatar-upload" className="text-sm cursor-pointer bg-white p-1 rounded-full shadow-md">
            📷
          </label>
        </div>
      </div>

      {/* Form Section */}
      <form className="mt-6 w-full space-y-4 flex flex-col">
        <input className="w-full p-3 border outline-[#CCE5FF] rounded-lg bg-white" placeholder="Full Name" />
        <input className="w-full p-3 border outline-[#CCE5FF] rounded-lg bg-white" placeholder="Email" />
        <input className="w-full p-3 border outline-[#CCE5FF] rounded-lg bg-white" placeholder="Address" />

        {/* Responsive Dropdown Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select className="p-3 border outline-[#CCE5FF] rounded-lg bg-white w-full sm:w-1/2">
            <option disabled selected>Select State</option>
            <option>Lagos</option>
            <option>Ibadan</option>
            <option>Kano</option>
            <option>Rivers</option>
          </select>
          <select className="p-3 border outline-[#CCE5FF] rounded-lg bg-white w-full sm:w-1/2">
            <option disabled selected>Select City</option>
            <option>Ikeja</option>
            <option>Abuja</option>
            <option>Paris</option>
            <option>London</option>
          </select>
        </div>

        <input type="date" className="w-full p-3 border outline-[#CCE5FF] rounded-lg bg-white" />

        {/* Gender */}
        <div className="flex items-center gap-4 justify-center">
          <span className="text-sm text-gray-700">Gender:</span>
          <label className="flex items-center gap-1">
            <input type="radio" name="gender" />
            <span>Female</span>
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="gender" defaultChecked />
            <span>Male</span>
          </label>
        </div>

        {/* Submit Button */}
        <button className="bg-red-500 hover:bg-red-600 transition text-white px-6 py-3 rounded-lg w-full sm:w-1/2 self-center">
          Update
        </button>
      </form>
    </div>
  );
}
