const { Resend } = require("resend");
const logger = require("./logger");

class EmailService {
  constructor() {
    this.providerName = process.env.EMAIL_PROVIDER || "resend";
    this.apiKey = process.env.RESEND_API_KEY;
    this.from = process.env.EMAIL_FROM || "Nexora <onboarding@resend.dev>";

    if (this.providerName === "resend" && this.apiKey && this.apiKey !== "mock") {
      this.client = new Resend(this.apiKey);
      logger.info("EmailService initialized with Resend provider.");
    } else {
      this.client = null;
      logger.info("EmailService initialized with Mock Console provider.");
    }
  }

  async sendEmail({ to, subject, html }) {
    logger.info(`Sending email to ${to} with subject "${subject}" using provider ${this.client ? "Resend" : "Mock"}`);

    if (this.client) {
      const { data, error } = await this.client.emails.send({
        from: this.from,
        to,
        subject,
        html,
      });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } else {
      // Mock Console logger fallback
      logger.debug(`[MOCK EMAIL SENT]
        From: ${this.from}
        To: ${to}
        Subject: ${subject}
        Content: ${html.replace(/<[^>]*>/g, "").trim().substring(0, 150)}...`);
      return { id: "mock_id_success" };
    }
  }

  async sendVerificationEmail(to, name, token) {
    const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email?token=${token}`;
    return this.sendEmail({
      to,
      subject: "Verify Your Email Address - Nexora",
      html: `
        <h2>Welcome to Nexora, ${name}!</h2>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This verification link is active for 24 hours.</p>
      `,
    });
  }

  async sendPasswordResetEmail(to, name, token) {
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;
    return this.sendEmail({
      to,
      subject: "Reset Your Password - Nexora",
      html: `
        <h2>Hello ${name},</h2>
        <p>We received a request to reset your account password. Click the link below to set a new password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      `,
    });
  }

  async sendBookingConfirmation(to, name, details) {
    return this.sendEmail({
      to,
      subject: "Session Booking Confirmed - Nexora",
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Hello ${name},</p>
        <p>Your session with mentor <strong>${details.mentorName}</strong> has been successfully booked and confirmed.</p>
        <p><b>Date:</b> ${details.date}</p>
        <p><b>Time:</b> ${details.time}</p>
        <p><b>Meeting Link:</b> <a href="${details.meetingUrl}">${details.meetingUrl}</a></p>
      `,
    });
  }

  async sendBookingCancellation(to, name, details) {
    return this.sendEmail({
      to,
      subject: "Session Booking Cancelled - Nexora",
      html: `
        <h2>Booking Cancelled</h2>
        <p>Hello ${name},</p>
        <p>We regret to inform you that your mentorship session on <strong>${details.date}</strong> has been cancelled.</p>
        <p>If a new booking slot is required, please consult the availability calendar to schedule another session.</p>
      `,
    });
  }

  async sendMentorVerification(to, name) {
    return this.sendEmail({
      to,
      subject: "Mentor Application Approved! - Nexora",
      html: `
        <h2>Congratulations ${name}!</h2>
        <p>Your application to join Nexora as a mentor has been approved by our administrators.</p>
        <p>You can now sign in to configure your availability slots and accept bookings.</p>
      `,
    });
  }

  async sendMentorRejection(to, name) {
    return this.sendEmail({
      to,
      subject: "Mentor Application Status - Nexora",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for your interest in joining Nexora as a mentor.</p>
        <p>After reviewing your credentials, we regret to inform you that we are unable to accept your application at this time.</p>
        <p>We wish you all the best in your professional journey.</p>
      `,
    });
  }
}

const emailService = new EmailService();

module.exports = {
  sendEmail: (opts) => emailService.sendEmail(opts),
  emailService,
};