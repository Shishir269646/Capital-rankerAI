import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Verify webhook signature
        const signature = request.headers.get("x-webhook-signature");

        if (!signature) {
            return NextResponse.json(
                { error: "Missing signature" },
                { status: 401 }
            );
        }

        const body = await request.json();

        // TODO: Implement webhook logic based on event type
        const { event, data } = body;

        switch (event) {
            case "deal.created":
                console.log("Deal created:", data);
                break;
            case "deal.scored":
                console.log("Deal scored:", data);
                break;
            case "portfolio.updated":
                console.log("Portfolio updated:", data);
                break;
            default:
                console.log("Unknown event:", event);
        }

        return NextResponse.json(
            { message: "Webhook processed" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Optional: GET method for webhook verification
export async function GET(request: NextRequest) {
    // Some webhook providers require GET verification
    const challenge = request.nextUrl.searchParams.get("challenge");

    if (challenge) {
        return NextResponse.json({ challenge }, { status: 200 });
    }

    return NextResponse.json(
        { message: "Webhook endpoint" },
        { status: 200 }
    );
}
