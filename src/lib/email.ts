import { Resend } from "resend";
import { getBaseUrl, maybeEnv } from "@/lib/env";
import type { CompletionRecipient } from "@/lib/types";
import { roundGraphPath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/utils";

export async function sendCompletionEmails(input: {
  roundSlug: string;
  recipients: CompletionRecipient[];
  baseUrl?: string;
}) {
  if (input.recipients.length === 0) {
    return;
  }

  const resendApiKey = maybeEnv("RESEND_API_KEY");
  const fromEmail = maybeEnv("RESEND_FROM_EMAIL");

  if (!resendApiKey || !fromEmail) {
    console.warn(
      "Skipping completion emails because RESEND_API_KEY or RESEND_FROM_EMAIL is not configured.",
    );
    return;
  }

  const resend = new Resend(resendApiKey);
  const graphUrl = absoluteUrl(
    getBaseUrl(input.baseUrl),
    roundGraphPath(input.roundSlug),
  );

  try {
    await resend.batch.send(
      input.recipients.map((recipient) => ({
        from: fromEmail,
        to: [recipient.email],
        subject: "Your friend graph is complete",
        html: `
          <div style="font-family: Helvetica, Arial, sans-serif; line-height: 1.5; color: #171717;">
            <p>Hi ${recipient.displayName},</p>
            <p>Your friend graph is complete. Check out your connections.</p>
            <p><a href="${graphUrl}">Open the final graph</a></p>
          </div>
        `,
      })),
    );
  } catch (error) {
    console.error("Failed to send completion emails.", error);
  }
}
