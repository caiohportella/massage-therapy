import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
    checkForConflicts,
    createGoogleCalendarEvent,
    getAvailableSlots,
} from "@/lib/GoogleCalendar";
import { sendWhatsAppMessage } from "@/lib/twilio";
import { formatConfirmationMessage } from "@/lib/whatsapp-messages/FormatConfirmationMessage";
import { formatConflictMessage } from "@/lib/whatsapp-messages/FormatConflictMessage";

interface AbacatePayWebhookEvent {
    event: string;
    data: {
        billing: {
            id: string;
            status: string;
            amount: number;
            paidAmount?: number;
            metadata?: Record<string, string>;
            customer?: {
                id: string;
                metadata: {
                    name?: string;
                    taxId?: string;
                    cellphone?: string;
                    email?: string;
                };
            };
            pixQrCode?: string;
            pixQrCodeBase64?: string;
        };
    };
}

// Verify AbacatePay webhook signature
function verifyWebhookSignature(
    payload: string,
    signature: string | null,
    secret: string
): boolean {
    if (!signature || !secret) return false;

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const signature = req.headers.get("x-abacatepay-signature");
    const webhookSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;

    // Verify signature if secret is configured
    if (webhookSecret) {
        const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
        if (!isValid) {
            console.error("❌ AbacatePay webhook signature verification failed");
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 401 }
            );
        }
    }

    let event: AbacatePayWebhookEvent;

    try {
        event = JSON.parse(rawBody);
    } catch (err) {
        console.error("❌ Failed to parse AbacatePay webhook payload:", err);
        return NextResponse.json(
            { error: "Invalid JSON payload" },
            { status: 400 }
        );
    }

    console.log("📥 AbacatePay webhook received:", event.event);

    // Handle billing paid event
    if (event.event === "BILLING_PAID" || event.event === "billing.paid") {
        const billing = event.data.billing;
        const metadata = billing.metadata;

        if (!metadata?.bookingId) {
            console.warn("❗ No bookingId in metadata, skipping...");
            return NextResponse.json({ received: true, skipped: true });
        }

        try {
            // Fetch the pending booking
            const booking = await prisma.booking.findUnique({
                where: { id: metadata.bookingId },
                include: {
                    services: { include: { service: true } },
                    user: true,
                },
            });

            if (!booking) {
                console.error("❌ Booking not found:", metadata.bookingId);
                return NextResponse.json(
                    { error: "Booking not found" },
                    { status: 404 }
                );
            }

            if (booking.paymentStatus === "paid") {
                console.log("ℹ️ Booking already processed, skipping...");
                return NextResponse.json({ received: true, alreadyProcessed: true });
            }

            const user = booking.user;
            const dateStr = booking.date.toISOString().split("T")[0];
            const timeStr = booking.time;
            const services = booking.services.map((bs) => bs.service);
            const totalDuration = services.reduce((sum, s) => sum + (s.duration || 60), 0);
            const rescheduleUrl = `${process.env.NEXT_PUBLIC_APP_URL}/booking`;

            // Check for calendar conflicts
            const { hasConflict } = await checkForConflicts({
                date: dateStr,
                time: timeStr,
                durationMinutes: totalDuration,
            });

            if (hasConflict) {
                console.log("⚠️ Time slot conflict detected for booking:", booking.id);

                // Get alternative slots
                const alternativeSlots = await getAvailableSlots({
                    startDate: dateStr,
                    durationMinutes: totalDuration,
                    daysToCheck: 14,
                    slotsToReturn: 5,
                });

                // Mark booking as conflict
                await prisma.booking.update({
                    where: { id: booking.id },
                    data: {
                        paymentStatus: "conflict",
                        paymentIntentId: billing.id,
                    },
                });

                // Send conflict WhatsApp message
                const conflictMessage = formatConflictMessage({
                    name: user.name,
                    requestedDate: dateStr,
                    requestedTime: timeStr,
                    alternativeSlots,
                    rescheduleUrl,
                });

                await sendWhatsAppMessage({
                    to: user.phone,
                    message: conflictMessage,
                });

                console.log("✅ Conflict notifications sent");
                return NextResponse.json({ received: true, conflict: true });
            }

            // No conflict - proceed with booking

            // Create Google Calendar event
            await createGoogleCalendarEvent({
                date: dateStr,
                time: timeStr,
                name: user.name,
                email: user.email,
                services: services.map((s) => s.name),
                durationMinutes: totalDuration,
                rescheduleUrl,
            });

            // Update booking status
            await prisma.booking.update({
                where: { id: booking.id },
                data: {
                    paymentStatus: "paid",
                    paymentIntentId: billing.id,
                },
            });

            // Send WhatsApp confirmation
            const confirmationMessage = formatConfirmationMessage({
                name: user.name,
                date: dateStr,
                time: timeStr,
                services: services.map((s) => s.name),
            });

            await sendWhatsAppMessage({
                to: user.phone,
                message: confirmationMessage,
            });

            console.log("✅ Booking completed successfully:", booking.id);
            return NextResponse.json({ received: true, success: true });

        } catch (error) {
            console.error("❌ Error processing AbacatePay webhook:", error);
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 }
            );
        }
    }

    // Handle other events if needed
    console.log("ℹ️ Unhandled event type:", event.event);
    return NextResponse.json({ received: true });
}
