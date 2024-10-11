"use client";
import { useEffect, useState } from "react";

export default function Customer() {
  const [name, setName] = useState("");
  const [dob, setDOB] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberno, setMember] = useState(1); // Starts at 1
  const [interest, setInterest] = useState("");
  const [customers, setCustomers] = useState([]);

  // Fetch customers from the database on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customer");
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleAddCustomer = async () => {
    const newCustomer = {
      name,
      dob,
      memberno, // Use memberno state
      interest,
    };

    try {
      const response = await fetch("/api/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer), // Use the newCustomer object directly
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);

        // Update the customer list by adding the new customer
        setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);

        // Increment member number for next customer
        setMember((prevMemberNo) => prevMemberNo + 1);

        // Clear input fields
        setName("");
        setDOB("");
        setInterest("");
      } else {
        console.error("Failed to add customer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`/api/customer/${customerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update the customers state to remove the deleted customer
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer._id !== customerId)
        );
        console.log("Customer deleted successfully");
      } else {
        console.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Add New Customer</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDOB(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCustomer}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Add Customer
          </button>
        </div>
      </div>

      <h4 className="text-xl font-semibold my-6">Customer List:</h4>
      <ul>
        {customers.map((customer) => (
          <li
            key={customer._id}
            className="mb-4 p-4 border border-gray-200 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">Name: {customer.name}</p>
              <p>
                Date of Birth: {new Date(customer.dob).toLocaleDateString()}
              </p>
              <p>Member No: {customer.memberno}</p>
              <p>Interest: {customer.interest}</p>
            </div>
            <button
              onClick={() => handleDeleteCustomer(customer._id)}
              className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
