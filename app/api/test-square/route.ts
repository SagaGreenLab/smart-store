import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { SquareClient, SquareEnvironment } from "square";

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment: SquareEnvironment.Sandbox,
});

export async function POST(req: NextRequest) {
  try {
    const { total } = await req.json();

    if (!total || total <= 0) {
      return NextResponse.json(
        { error: "Invalid total amount" },
        { status: 400 }
      );
    }

    const response = await client.orders.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems: [
          {
            name: "SAGA GREEN Smart Store",
            quantity: "1",
            basePriceMoney: {
              amount: BigInt(total),
              currency: "JPY",
            },
          },
        ],
      },
    });

    return NextResponse.json({
      status: "order_created",
      orderId: response.order?.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create order",
      },
      {
        status: 500,
      }
    );
  }
}