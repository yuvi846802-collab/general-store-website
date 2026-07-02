import nodemailer from 'nodemailer';

// Create a generic email sender
export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
  html?: string;
}) => {
  // Use Mailtrap for dev, or real SMTP for prod
  // For now, if no credentials exist, we will just log the email (Mock)
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT) {
    console.log('\n--- MOCK EMAIL SENDER ---');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.message}`);
    console.log(`HTML: ${options.html}`);
    console.log('-------------------------\n');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Hakeem Store <${process.env.EMAIL_FROM || 'noreply@hakeemstore.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};
