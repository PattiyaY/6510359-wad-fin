import Customer from "@/models/Customer";
import connectMongoDB from "../../../lib/db";
import { NextResponse } from "next/server";

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

// PUT request handler
export async function PUT(req) {
  try {
    await connectMongoDB(); // Ensure MongoDB connection is established
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Get the ID from query parameters
    const updatedData = await req.json(); // Get updated data from request body

    const result = await Customer.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the modified document
      runValidators: true, // Validate against the schema
    });

    if (!result) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Customer updated successfully", customer: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { message: "Failed to update customer", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE request handler
export async function DELETE(req) {
  try {
    await connectMongoDB(); // Ensure MongoDB connection is established
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Get the ID from query parameters
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { message: "Failed to delete customer", error: error.message },
      { status: 500 }
    );
  }
}
