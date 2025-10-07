// BACKEND/models/user.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name']
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'superadmin'],
            default: 'user'
        },
        permissions: {
            canManageProducts: { type: Boolean, default: false },
            canManageOrders: { type: Boolean, default: false },
            canManageUsers: { type: Boolean, default: false },
            canViewAnalytics: { type: Boolean, default: false },
            canManageCategories: { type: Boolean, default: false },
            canManageAdmins: { type: Boolean, default: false }
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Set permissions based on role before saving
UserSchema.pre('save', function(next) {
    if (this.isModified('role')) {
        if (this.role === 'superadmin') {
            this.permissions = {
                canManageProducts: true,
                canManageOrders: true,
                canManageUsers: true,
                canViewAnalytics: true,
                canManageCategories: true,
                canManageAdmins: true
            };
        } else if (this.role === 'admin') {
            this.permissions = {
                canManageProducts: true,
                canManageOrders: true,
                canManageUsers: false,
                canViewAnalytics: true,
                canManageCategories: true,
                canManageAdmins: false
            };
        } else {
            this.permissions = {
                canManageProducts: false,
                canManageOrders: false,
                canManageUsers: false,
                canViewAnalytics: false,
                canManageCategories: false,
                canManageAdmins: false
            };
        }
    }
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);