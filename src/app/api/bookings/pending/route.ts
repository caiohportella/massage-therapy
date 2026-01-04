import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SelectedService, PersonalData } from "@/lib/types";

export interface PendingBookingData {
    date: string;
    time: string;
    selectedServices: SelectedService[];
    personalData: PersonalData;
    totalDuration: number;
}

// Store pending booking before payment
export async function POST(req: NextRequest) {
    try {
        const data: PendingBookingData = await req.json();

        if (!data.date || !data.time || !data.selectedServices || !data.personalData) {
            return NextResponse.json(
                { error: "Dados incompletos para o agendamento." },
                { status: 400 }
            );
        }

        // Calculate total duration
        const totalDuration = data.selectedServices.reduce(
            (sum, s) => sum + (s.duration || 60),
            0
        );

        // Store in a temporary table or use booking with pending status
        const pendingBooking = await prisma.booking.create({
            data: {
                date: new Date(data.date),
                time: data.time,
                scheduledAt: new Date(`${data.date}T${data.time}`),
                totalAmount: data.selectedServices.reduce((sum, s) => sum + s.price * s.quantity, 0),
                paymentStatus: "pending",
                user: {
                    connectOrCreate: {
                        where: { email: data.personalData.email },
                        create: {
                            name: data.personalData.fullName,
                            email: data.personalData.email,
                            phone: data.personalData.phone,
                            address: data.personalData.address,
                            number: data.personalData.number,
                            complement: data.personalData.complement || "",
                            district: data.personalData.district,
                            city: data.personalData.city,
                            state: data.personalData.state,
                            zipCode: data.personalData.zipCode,
                        },
                    },
                },
                services: {
                    create: data.selectedServices.map((s) => ({
                        service: { connect: { productId: s.productId } },
                    })),
                },
            },
            include: {
                services: { include: { service: true } },
                user: true,
            },
        });

        console.log("✅ Pending booking created:", pendingBooking.id);

        return NextResponse.json({
            success: true,
            bookingId: pendingBooking.id,
            totalDuration,
        });
    } catch (error) {
        console.error("❌ Erro ao criar pending booking:", error);
        return NextResponse.json(
            { error: "Erro ao criar agendamento pendente." },
            { status: 500 }
        );
    }
}

// Get pending booking by ID
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "ID do agendamento não fornecido." },
                { status: 400 }
            );
        }

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                services: { include: { service: true } },
                user: true,
            },
        });

        if (!booking) {
            return NextResponse.json(
                { error: "Agendamento não encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json({ booking });
    } catch (error) {
        console.error("❌ Erro ao buscar pending booking:", error);
        return NextResponse.json(
            { error: "Erro ao buscar agendamento." },
            { status: 500 }
        );
    }
}

// Delete pending booking (cleanup)
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { error: "ID do agendamento não fornecido." },
                { status: 400 }
            );
        }

        // First delete related BookingService records
        await prisma.bookingService.deleteMany({
            where: { bookingId: id },
        });

        // Then delete the booking
        await prisma.booking.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erro ao deletar pending booking:", error);
        return NextResponse.json(
            { error: "Erro ao deletar agendamento." },
            { status: 500 }
        );
    }
}
