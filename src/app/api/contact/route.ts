import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  company: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  service: z.string().trim().optional(),
  message: z.string().trim().optional(),
  website: z.string().optional(), // Honeypot
  source: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot check - silently discard bots
    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true, message: "Message received" });
    }

    const validated = contactSchema.safeParse(body);

    if (!validated.success) {
      const formattedErrors: Record<string, string> = {};
      validated.error.errors.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0].toString()] = err.message;
        }
      });
      return NextResponse.json(
        { ok: false, errors: formattedErrors },
        { status: 400 }
      );
    }

    const { name, email, company, phone, service, message, source } = validated.data;

    const contactTo = process.env.CONTACT_TO || "info@prismtechsolutions.com";
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);

    const emailSubject = `New inquiry from ${name}${company ? ` (${company})` : ""}${service ? ` — ${service}` : ""}`;
    const emailText = `
Name: ${name}
Email: ${email}
Company: ${company || "Not provided"}
Phone: ${phone || "Not provided"}
Interested in: ${service || "General Inquiry"}
Source: ${source || "Website Contact Form"}

Message:
${message || "No message body provided (Lead popup)"}
    `.trim();

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${name}" <${smtpUser}>`,
        replyTo: email,
        to: contactTo,
        subject: emailSubject,
        text: emailText,
      });
    } else {
      // In local dev without SMTP configured, log to console
      console.log("=== Contact Submission Received ===");
      console.log(emailText);
      console.log("====================================");
    }

    return NextResponse.json({ ok: true, message: "Thank you! Your message has been sent." });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
