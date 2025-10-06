import mongoose from 'mongoose';

const swapSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  offeredItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    default: null // null for point-based redemption
  },
  swapType: {
    type: String,
    enum: ['direct', 'points'],
    required: true
  },
  pointsOffered: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('Swap', swapSchema);