import mongoose from 'mongoose';
 

const userschema = new mongoose.Schema({
    name: { type: String, required: true },
    role: {
        type: String,
        enum: ['Customer', 'Admin'],
        required: true
    },
    isActivated: { type: Boolean, default: false }
});

const customerSchema = new mongoose.Schema({
    ...userschema.obj,
    name: { type: String, required: true },
    age: { type: Number, min: 1, max: 120 },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
    role: { type: String, enum: ['Customer'], default: 'Customer' },
    isActivated: { type: Boolean, default: false },
    photo: { type: String, required: false },
}); 

const adminSchema = new mongoose.Schema({
    ...userschema.obj,
    email: { type: String, required: true, unique: true,  },
    password: { type: String, required: true },
    phone: { type: String,  }, // Optional phone validation
    role: { type: String, enum: ['Admin'], default: 'Admin' }
});

// Models
export const Customer = mongoose.model('Customer', customerSchema);
export const Admin = mongoose.model('Admin', adminSchema);
export const User = mongoose.model('User', userschema);

export default { Customer, Admin, User };
