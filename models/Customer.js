import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  memberno: { type: Number, required: true },
  interest: { type: String, required: true },
});

const Customer =
  mongoose.models.product || mongoose.model("customers", customerSchema);

export default Customer;
