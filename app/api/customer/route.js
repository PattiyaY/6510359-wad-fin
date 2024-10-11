import Customer from "@/models/Customer";
import connectMongoDB from "../../../lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET request handler
export async function GET(req) {
  try {
    // Ensure MongoDB connection is established
    await connectMongoDB();
    console.log("Connected to MongoDB");

    // Fetch all customers from the database
    const customers = await Customer.find();
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { message: "Failed to fetch customers", error: error.message },
      { status: 500 }
    );
  }
}

// POST request handler
export async function POST(req) {
  try {
    // Parse the request body
    const { name, dob, memberno, interest } = await req.json();

    // Log the received data to ensure everything is correct
    console.log("Received customer data:", {
      name,
      dob,
      memberno,
      interest,
    });

    // Ensure MongoDB connection is established
    await connectMongoDB();
    console.log("Connected to MongoDB");

    // Create the customer document in the MongoDB collection
    const customer = await Customer.create({
      name,
      dob,
      memberno,
      interest,
    });

    console.log("Customer created:", customer);

    // Return success response with customer data
    return NextResponse.json(
      { message: "Customer added successfully.", customer },
      { status: 201 }
    );
  } catch (error) {
    // Log any errors during the process
    console.error("Error adding customer: ", error);

    // Return error response
    return NextResponse.json(
      { message: "Failed to add customer.", error: error.message },
      { status: 500 }
    );
  }
}

// export async function PUT() {
//   return Response.json(await Product.find());
// }

export async function DELETE(req, { params }) {
  await connectMongoDB();
  const id = params.id;
  const customer = await Customer.findByIdAndDelete(id);
  return Response.json(customer);
}
