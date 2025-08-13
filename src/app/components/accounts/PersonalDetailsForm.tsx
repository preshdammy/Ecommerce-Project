"use client";

import Image from "next/image";
import dummy from "../../../../public/figma images/Frame 164.png";
import camera from "../../../../public/figma images/camera.png";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UPSERT_PROFILE = gql`
  mutation UpsertProfile($input: UserProfileInput!) {
    upsertProfile(input: $input) {
      id
      name
      email
      address
      state
      city
      gender
      dateOfBirth
      profilePicture
    }
  }
`;

const stateCityMap: Record<string, string[]> = {
  "Abia": ["Umuahia", "Aba", "Ohafia", "Arochukwu"],
  "Adamawa": ["Yola", "Jimeta", "Mubi", "Numan"],
  "Akwa Ibom": ["Uyo", "Ikot Ekpene", "Ikot Abasi", "Oron"],
  "Anambra": ["Awka", "Onitsha"],
  "Bauchi": ["Bauchi", "Azare", "Misau"],
  "Bayelsa": ["Yenagoa", "Brass"],
  "Benue": ["Makurdi", "Otukpo"],
  "Borno": ["Maiduguri", "Biu", "Dikwa"],
  "Cross River": ["Calabar", "Ogoja"],
  "Delta": ["Asaba", "Warri", "Sapele", "Ughelli", "Burutu"],
  "Ebonyi": ["Abakaliki"],
  "Edo": ["Benin City"],
  "Ekiti": ["Ado‑Ekiti", "Effon‑Alaiye", "Ikere‑Ekiti"],
  "Enugu": ["Enugu", "Nsukka"],
  "FCT - Abuja": ["Abuja", "Garki", "Maitama", "Asokoro"],
  "Gombe": ["Gombe", "Kumo", "Deba Habe"],
  "Imo": ["Owerri"],
  "Jigawa": ["Dutse", "Birnin Kudu", "Hadejia", "Gumel", "Kazaure"],
  "Kaduna": ["Kaduna", "Zaria", "Kafanchan"],
  "Kano": ["Kano", "Wudil", "Gaya"],
  "Katsina": ["Katsina", "Daura", "Funtua"],
  "Kebbi": ["Birnin Kebbi", "Argungu", "Gwandu"],
  "Kogi": ["Lokoja", "Idah", "Kabba", "Okene"],
  "Kwara": ["Ilorin", "Offa", "Jebba", "Lafiagi"],
  "Lagos": ["Lagos", "Ikeja", "Ikorodu", "Lekki", "Epe", "Badagry", "Mushin", "Shomolu"],
  "Nasarawa": ["Lafia", "Keffi", "Nasarawa"],
  "Niger": ["Minna", "Suleja", "Bida", "Kontagora", "Lapai"],
  "Ogun": ["Abeokuta", "Ijebu‑Ode", "Shagamu", "Ilaro"],
  "Ondo": ["Akure", "Ondo", "Okitipupa"],
  "Osun": ["Oshogbo", "Ile‑Ife", "Ilesa", "Iwo"],
  "Oyo": ["Ibadan", "Oyo", "Ogbomosho", "Iseyin", "Igboho"],
  "Plateau": ["Jos"],
  "Rivers": ["Port Harcourt", "Bonny", "Omoku", "Buguma", "Okrika"],
  "Sokoto": ["Sokoto"],
  "Taraba": ["Jalingo"],
  "Yobe": ["Damaturu", "Gashua"],
  "Zamfara": ["Gusau"]
};


export default function PersonalDetailsForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    state: "",
    city: "",
    gender: "",
    dateOfBirth: "",
    profilePicture: "",
  });

  const [upsertProfile, { loading }] = useMutation(UPSERT_PROFILE, {
    onCompleted: (data) => {
      if (data?.upsertProfile) {
        setFormData(data.upsertProfile);
        setImagePreview(data.upsertProfile.profilePicture);
        toast.success("Profile saved successfully");
      }
    },
    onError: (error) => {
      console.error("UPSERT_PROFILE error:", error.message);
      toast.error(error.message || "Failed to save profile");
    },
  });

  // Load profile automatically from cookie
  useEffect(() => {
    const storedUserInfo = Cookies.get("userinfo");
    if (storedUserInfo) {
      try {
        const parsed = JSON.parse(storedUserInfo);
        if (parsed?.id) {
          setUserId(parsed.id);
          // Hit the same mutation with only ID to fetch existing data
          upsertProfile({
            variables: {
              input: { id: parsed.id },
            },
          });
        }
      } catch (err) {
        console.error("Failed to parse userinfo cookie", err);
      }
    }
  }, [upsertProfile]);

  const uploadToCloudinary = async (base64Image: string) => {
    try {
      const res = await fetch("/api/cloudinary-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: base64Image }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      return data.secure_url as string;
    } catch (error: any) {
      toast.error("Image upload failed: " + error.message);
      throw error;
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile picture too large. Max 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);

      // Upload image to Cloudinary
      try {
        const cloudinaryUrl = await uploadToCloudinary(base64);
        setFormData((prev) => ({ ...prev, profilePicture: cloudinaryUrl }));
      } catch {
        // Error already handled in uploadToCloudinary
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!userId) {
    toast.error("User ID not found");
    return;
  }

  const requiredFields = ["name", "email", "state", "city"];
  for (let field of requiredFields) {
    if (!formData[field as keyof typeof formData]) {
      toast.error(`Please fill in ${field}`);
      return;
    }
  }

  // Create a copy of formData without __typename
  const { __typename, ...inputWithoutTypename } = formData as any;

  await upsertProfile({
    variables: {
      input: {
        id: userId,
        ...inputWithoutTypename,
      },
    },
  });
};


  const availableCities = formData.state
    ? stateCityMap[formData.state] || []
    : [];

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-10 min-h-screen">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden">
       {imagePreview ? (
                     <Image src={imagePreview} alt="Avatar" fill className="object-cover" />
                   ) : (
                     <Image src={dummy} alt="Avatar" fill className="object-cover" />
                   )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md"
        >
          <Image src={camera} alt="Upload" width={30} height={30} />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-8 space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-3 border rounded-lg"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full sm:w-1/2"
            required
          >
            <option disabled value="">
              Select State
            </option>
            {Object.keys(stateCityMap).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="p-3 border rounded-lg w-full sm:w-1/2"
            disabled={!formData.state}
            required
          >
            <option disabled value="">
              {formData.state ? "Select City" : "Select State First"}
            </option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />
        <div className="flex items-center gap-4 justify-center">
          <span className="text-sm text-gray-700">Gender:</span>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
            />
            <span>Female</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
            />
            <span>Male</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF4C3B] hover:bg-red-600 text-white px-6 py-3 rounded-2xl self-center"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}



