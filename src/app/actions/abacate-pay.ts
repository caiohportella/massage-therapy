"use server";

interface Product {
    externalId: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
}

interface Customer {
    name: string;
    taxId: string;
    cellphone: string;
    email: string;
}

interface BillingResponse {
    error: null | string;
    data: {
        id: string;
        products: Array<{
            id: string;
            externalId: string;
            quantity: number;
        }>;
        amount: number;
        status: string;
        devMode: boolean;
        methods: string[];
        url: string;
        customer?: {
            id: string;
            metadata: {
                name?: string;
                taxId?: string;
                cellphone?: string;
                email?: string;
            }
        }
    }
}

export async function createPixPayment(products: Product[], customer: Customer) {
    try {
        const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
        if (totalPrice < 100) throw new Error("O valor mínimo para pagamento é de R$1,00.");

        if (!customer) throw new Error("Cliente inválido.");

        const body = JSON.stringify({
            frequency: 'ONE_TIME',
            methods: ['PIX'],
            products: products.map((p) => ({
                externalId: p.externalId,
                name: p.name,
                description: p.description || p.name,
                quantity: p.quantity,
                price: p.price,
            })),
            customer: {
                name: customer.name,
                taxId: customer.taxId,
                cellphone: customer.cellphone,
                email: customer.email,
            },
            returnUrl: process.env.NEXT_PUBLIC_APP_URL,
            completionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        })

        const res = await fetch("https://api.abacatepay.com/v1/billing/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.ABACATEPAY_API_KEY}`,
            },
            body,
        })

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro ao criar pagamento com Pix: ${errorText}`);
        }

        const data: BillingResponse = await res.json();

        if (data.error) {
            throw new Error(`Erro ao criar pagamento com Pix: ${data.error}`);
        }

        return data;

    } catch (err) {
        console.error("Erro ao criar pagamento com Pix:", err);
        return {
            error: "Erro ao criar pagamento com Pix. Tente novamente mais tarde.",
        };
    }
}