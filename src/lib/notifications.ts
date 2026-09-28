import { Memory } from '@/models';
import connectDB from '@/lib/mongodb';

export interface NotificationSettings {
  emailEnabled: boolean;
  email: string;
  reminderTime: string; // HH:MM format
  reminderDays: number[]; // Days of week (0-6, 0 = Sunday)
}

/**
 * Get memories due for review within the next 24 hours
 */
export async function getMemoriesDueForReview(userId: string): Promise<typeof Memory.prototype[]> {
  try {
    await connectDB();
    
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const memories = await Memory.find({
      userId,
      nextReview: { $lte: tomorrow },
    }).sort({ nextReview: 1 });

    return memories;
  } catch (error) {
    console.error('Error fetching memories due for review:', error);
    return [];
  }
}

/**
 * Send review reminder notification
 */
export async function sendReviewReminder(
  userId: string,
  settings: NotificationSettings
): Promise<boolean> {
  try {
    const memories = await getMemoriesDueForReview(userId);

    if (memories.length === 0) {
      return false;
    }

    if (settings.emailEnabled && settings.email) {
      await sendEmailReminder(settings.email, memories.length);
    }

    return true;
  } catch (error) {
    console.error('Error sending review reminder:', error);
    return false;
  }
}

/**
 * Send email reminder (placeholder implementation)
 */
async function sendEmailReminder(email: string, memoryCount: number): Promise<void> {
  // Placeholder: In production, integrate with email service like:
  // - SendGrid
  // - AWS SES
  // - Resend
  // - Nodemailer with SMTP
  
  console.log(`[Email Reminder] To: ${email}, Memories due: ${memoryCount}`);
  
  // Example implementation with SendGrid:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // const msg = {
  //   to: email,
  //   from: process.env.SENDGRID_FROM_EMAIL,
  //   subject: 'Review Reminder: You have memories due for review',
  //   text: `You have ${memoryCount} memories due for review today. Visit your app to review them.`,
  // };
  // await sgMail.send(msg);
}

/**
 * Check if it's time to send a reminder based on user settings
 */
export function shouldSendReminder(settings: NotificationSettings): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Check if today is in reminder days
  if (!settings.reminderDays.includes(currentDay)) {
    return false;
  }

  // Check if current time matches reminder time
  const [reminderHours, reminderMinutes] = settings.reminderTime.split(':').map(Number);
  const reminderTime = reminderHours * 60 + reminderMinutes;

  // Send reminder if within 5 minutes of reminder time
  return Math.abs(currentTime - reminderTime) <= 5;
}

/**
 * Schedule notification job (placeholder for cron job)
 */
export function scheduleNotificationJob(userId: string, settings: NotificationSettings): void {
  // Placeholder: In production, use:
  // - node-cron
  // - agenda
  // - bull queue
  // - Vercel Cron Jobs
  
  console.log(`[Notification Job] Scheduled for user ${userId} at ${settings.reminderTime}`);
}
