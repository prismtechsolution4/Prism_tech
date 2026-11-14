import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address").optional().or(z.literal("")),
  company: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  service: z.string().trim().optional(),
  message: z.string().trim().optional(),
  website: z.string().optional(), // Honeypot
  source: z.string().optional(),
}).refine(data => data.email || data.phone, {
  message: "Please provide either an email or phone number",
  path: ["email"],
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

    // Contact Target Configuration
    const contactTo = process.env.CONTACT_TO || "info@prismtechsolutions.com";
    const targetWhatsApp = process.env.WHATSAPP_PHONE || "923198669833";
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);

    const emailSubject = `New inquiry from ${name}${company ? ` (${company})` : ""}${service ? ` — ${service}` : ""}`;
    const emailText = `
PrismTech Solutions - New Inquiry
====================================
Name: ${name}
Email: ${email || "Not provided"}
Phone: ${phone || "Not provided"}
Company: ${company || "Not provided"}
Interested in: ${service || "General Inquiry"}
Source: ${source || "Website Contact Form"}

Message:
${message || "No message body provided"}
====================================
Timestamp: ${new Date().toISOString()}
    `.trim();

    // 1. Send Email Notification via SMTP if configured
    if (smtpHost && smtpUser && smtpPass) {
      try {
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
          from: `"PrismTech Inquiries" <${smtpUser}>`,
          replyTo: email || smtpUser,
          to: contactTo,
          subject: emailSubject,
          text: emailText,
        });
        console.log(`[Email Dispatched] Successfully sent notification to ${contactTo}`);
      } catch (mailErr) {
        console.error("[Email Error] Failed to send via SMTP:", mailErr);
      }
    } else {
      console.log("=== Contact Submission Received (SMTP not configured) ===");
      console.log(emailText);
      console.log("=========================================================");
    }

    // 2. Prepare WhatsApp Notification Payload (Clean universal formatting, avoiding unsupported emoji byte corruption)
    const whatsappNotificationText = `*New Lead - PrismTech Solutions*
----------------------------------------
*Name:* ${name}
*Email:* ${email || "Not provided"}
*Phone:* ${phone || "Not provided"}
*Company:* ${company || "Not provided"}
*Interest:* ${service || "General Inquiry"}
*Source:* ${source || "Website Form"}

*Message:*
${message || "No message body provided"}
----------------------------------------
*Time:* ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}`;

    const whatsappUrl = `https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(whatsappNotificationText)}`;

    // 3. Dispatch Server-Side WhatsApp Notification if gateway configured
    if (process.env.CALLMEBOT_API_KEY) {
      try {
        const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${targetWhatsApp}&text=${encodeURIComponent(whatsappNotificationText)}&apikey=${process.env.CALLMEBOT_API_KEY}`;
        fetch(callmebotUrl).catch((err) => console.error("[CallMeBot] Error:", err));
        console.log(`[WhatsApp API] Dispatched via CallMeBot to +${targetWhatsApp}`);
      } catch (waErr) {
        console.error("[WhatsApp API Error]:", waErr);
      }
    }

    if (process.env.WHATSAPP_WEBHOOK_URL) {
      try {
        fetch(process.env.WHATSAPP_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: targetWhatsApp,
            message: whatsappNotificationText,
            lead: { name, email, phone, company, service, message, source },
          }),
        }).catch((err) => console.error("[WhatsApp Webhook] Error:", err));
        console.log(`[WhatsApp Webhook] Dispatched to webhook endpoint`);
      } catch (waErr) {
        console.error("[WhatsApp Webhook Error]:", waErr);
      }
    }

    console.log("=== WhatsApp Notification Summary ===");
    console.log(`Target Number: +${targetWhatsApp}`);
    console.log(`WhatsApp Link: ${whatsappUrl}`);
    console.log("=====================================");

    return NextResponse.json({
      ok: true,
      message: "Thank you! Your message has been sent to our email and WhatsApp.",
      whatsappUrl,
      whatsappNumber: "+92 319 8669833",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
