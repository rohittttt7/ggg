import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { mockUserDb } from '../mockDb.js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 100 // Starting points for new users
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  joinedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const MongoUser = mongoose.model('User', userSchema);

// Mock User class that mimics Mongoose model
class MockUser {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    if (!this.isModified || !this.isModified('password')) {
      // Hash password for new users
      if (this.password && !this.password.startsWith('$2b$')) {
        this.password = await bcrypt.hash(this.password, 12);
      }
    }
    const result = await mockUserDb.save(this);
    Object.assign(this, result);
    return this;
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  isModified(field) {
    return true; // For mock, always assume modified
  }

  static async findOne(query) {
    return await mockUserDb.findOne(query);
  }

  static async findById(id) {
    const user = await mockUserDb.findById(id);
    return user ? new MockUser(user) : null;
  }

  static async findByIdAndUpdate(id, update, options) {
    return await mockUserDb.findByIdAndUpdate(id, update, options);
  }

  select(fields) {
    const user = { ...this };
    if (fields === '-password') {
      delete user.password;
    }
    return user;
  }
}

// Export the appropriate model based on database mode
const User = global.useMockDb ? MockUser : MongoUser;

export default User;