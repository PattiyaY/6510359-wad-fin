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
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [currentCustomerId, setCurrentCustomerId] = useState(null); // Store current customer ID for editing

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE; // Set API base URL

  // Fetch customers from the database on component mount
  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE}/customer`);
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

  const handleAddCustomer = async () => {
    const newCustomer = {
      name,
      dob,
      memberno,
      interest,
    };

    try {
      const response = await fetch(`${API_BASE}/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
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
    console.log("Deleting customer with ID:", customerId);
    try {
      const response = await fetch(`${API_BASE}/customer?id=${customerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
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

  const handleEditCustomer = (customer) => {
    setIsEditing(true);
    setCurrentCustomerId(customer._id);
    setName(customer.name);
    setDOB(customer.dob);
    setInterest(customer.interest);
  };

  const handleUpdateCustomer = async () => {
    const updatedCustomer = {
      name,
      dob,
      interest,
    };

    try {
      const response = await fetch(
        `${API_BASE}/customer?id=${currentCustomerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCustomer),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);

        // Update local state with edited customer
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer._id === currentCustomerId
              ? { ...customer, ...updatedCustomer }
              : customer
          )
        );

        // Reset editing state
        setIsEditing(false);
        setCurrentCustomerId(null);
        setName("");
        setDOB("");
        setInterest("");
      } else {
        console.error("Failed to update customer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <div className="max-w-md mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Customer" : "Add New Customer"}
        </h3>
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
            onClick={isEditing ? handleUpdateCustomer : handleAddCustomer}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {isEditing ? "Update Customer" : "Add Customer"}
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
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditCustomer(customer)}
                className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCustomer(customer._id)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
