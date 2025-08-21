export default function ChangeContactDetailsForm() {
  return (
    <div className="w-full h-auto max-w-md mx-auto px-4 py-8">
      <form className="space-y-6 bg-none">
        {/* Phone number input */}
        <input
          type="tel"
          placeholder="08034378124"
          className="w-full border-2 bg-white border-[#D4D3D3] rounded-md px-4 py-3 text-base focus:outline-none focus:ring-0 focus:border-blue-600"
        />

        {/* How to change number dropdown */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            How do you want to change your number?
          </label>
          <select
            className="w-full border-2 border-[#D4D3D3] rounded-md px-4 py-3 text-base bg-white focus:outline-none focus:ring-0 focus:border-blue-600 c text-[#272222] tracking-[1px]"
          >
            <option>Message</option>
            <option>Email verification</option>
            <option>Call confirmation</option>
          </select>
        </div>

        {/* Change type dropdown */}
        <select
          className="w-full border-2 border-[#D4D3D3] rounded-md px-4 py-3 text-base bg-white focus:outline-none focus:ring-0 focus:border-blue-600 text-[16px] text-[#272222] tracking-[1px]"
        >
          <option>Change email</option>
          <option>Change phone number</option>
          <option>Change both</option>
        </select>

        {/* Save Button */}
        <button
          type="submit"
          className="bg-[#FF4C3B] text-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide w-1/2 sm:w-[150px] mx-auto block hover:bg-red-600"
        >
          SAVED
        </button>
      </form>
    </div>
  );
}
