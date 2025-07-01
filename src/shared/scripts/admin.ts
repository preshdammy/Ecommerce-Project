
import dotenv from "dotenv";
dotenv.config(); 

import { connect } from "../database/db.connect";
import Admin from "../database/model/admin.model";
import bcrypt from "bcryptjs";

async function seedAdmins() {
  await connect();

  const admins = [
  {
    name: "Precious",
    email: "preciousdammy02@gmail.com",
    password: "admin222@@",
    role: "ADMIN" 
  },
  {
    name: "Ope",
    email: "Opemiposhofolahan@gmail.com",
    password: "admin222@@",
    role: "ADMIN" 
  },
  {
    name: "Usman",
    email: "usman@gmail.co",
    password: "admin222@@",
    role: "ADMIN" 
  },
  {
    name: "Afolabi",
    email: "afolabi@gmail.com.com",
    password: "admin222@@",
    role: "ADMIN" 
  },
  ];

  for (const adminData of admins) {
    const exists = await Admin.findOne({ email: adminData.email });
    if (exists) {
      console.log(` Admin with email ${adminData.email} already exists`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = await Admin.create({
      name: adminData.name,
     email: adminData.email,
     password: hashedPassword,
     role: adminData.role,
});


    console.log("Admin created:", {
      email: admin.email,
      id: admin._id,
    });
  }

  process.exit(); 
}

seedAdmins();
