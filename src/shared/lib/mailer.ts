
import nodemailer from "nodemailer";

const senderAccounts = [
  {
    user: process.env.EMAIL_USERNAME_1!,
    pass: process.env.EMAIL_PASSWORD_1!,
  },
  {
    user: process.env.EMAIL_USERNAME_2!,
    pass: process.env.EMAIL_PASSWORD_2!,
  },
  {
    user: process.env.EMAIL_USERNAME_3!,
    pass: process.env.EMAIL_PASSWORD_3!,
  },
  {
    user: process.env.EMAIL_USERNAME_4!,
    pass: process.env.EMAIL_PASSWORD_4!,
  },
];

// Pick a random sender to rotate usage
const getRandomSender = () => {
  const index = Math.floor(Math.random() * senderAccounts.length);
  return senderAccounts[index];
};

export const sendLoginNotification = async (toEmail: string) => {
  const sender = getRandomSender();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: sender.user,
      pass: sender.pass,
    },
  });

  await transporter.sendMail({
    from: `"Ecommerce Admin" <${sender.user}>`,
    to: toEmail,
    subject: "Admin Login Notification",
    html: `
      <h2>Admin Login Alert</h2>
      <p>You have successfully logged in to the admin dashboard.</p>
      <p>If this wasn't you, please reset your password immediately.</p>
    `,
  });
};
