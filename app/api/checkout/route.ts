import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { SquareClient, SquareEnvironment } from "square";

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

export async function POST(req: NextRequest) {
  try {
    console.log("SQUARE_LOCATION_ID =", process.env.SQUARE_LOCATION_ID);
console.log(
  "SQUARE_ACCESS_TOKEN exists =",
  !!process.env.SQUARE_ACCESS_TOKEN
);
    const { amount } = await req.json();

    const response = await client.orders.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems: [
          {
            name: "Plant Purchase",
            quantity: "1",
            basePriceMoney: {
              amount: BigInt(amount),
              currency: "JPY",
            },
          },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      orderId: response.order?.id,
    });
  } catch (error) {
    console.error("Square Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}