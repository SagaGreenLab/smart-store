import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { SquareClient, SquareEnvironment } from "square";

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN!,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

export async function POST() {
  try {
    const response = await client.devices.codes.create({
      idempotencyKey: randomUUID(),
      deviceCode: {
        name: "SAGA HATSU",
        productType: "TERMINAL_API",
        locationId: process.env.SQUARE_LOCATION_ID!,
      },
    });

    return NextResponse.json(response.deviceCode);
  } catch (error) {
    console.error("Device Code Error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}