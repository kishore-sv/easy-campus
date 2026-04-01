const mongoose = require('mongoose');

// Faculty Model
const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  cabin: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['Available', 'In Class', 'Busy', 'On Break', 'Away'], default: 'Available' },
  image: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
  email: { type: String },
  phone: { type: String },
  specialization: { type: String },
  experience: { type: String },
  officeHours: { type: String }
}, { timestamps: true });

const Faculty = mongoose.model('Faculty', facultySchema);

// Event Model
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  venue: { type: String, required: true },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

// Product Model (Food/Stationery)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Food', 'Stationery'], required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Order Model
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  status: { type: String, enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// Complaint Model
const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' }
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

// Lost & Found Model
const lostFoundSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['Lost', 'Found'], default: 'Lost' }
}, { timestamps: true });

const LostFound = mongoose.model('LostFound', lostFoundSchema);

module.exports = {
  Faculty,
  Event,
  Product,
  Order,
  Complaint,
  LostFound
};
