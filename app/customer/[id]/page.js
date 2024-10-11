export default async function Home({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  // Fetch customer details using the customer ID from params
  const response = await fetch(`${API_BASE}/customer?id=${params.id}`, {
    cache: "no-store",
  });

  // Assuming the response is a single customer object
  const customer = await response.json();

  // Log the customer details for debugging
  console.log({ customer });

  return (
    <div className="m-4">
      <h1>Customer Details</h1>
      <p className="font-bold text-xl text-blue-800">{customer.name}</p>
      <p>Date of Birth: {customer.dob}</p>
      <p>Member No: {customer.memberno}</p>
      <p>Interest: {customer.interest}</p>
    </div>
  );
}
