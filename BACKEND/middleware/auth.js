import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

export const superAdminOnly = async (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Super Admin only.'
        });
    }
};

export const adminOnly = async (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin access required.'
        });
    }
};

export const checkPermission = (permission) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        // Super admin has all permissions
        if (req.user.role === 'superadmin') {
            return next();
        }

        // Check if user has the required permission
        if (req.user.permissions && req.user.permissions.includes(permission)) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: `Access denied. Required permission: ${permission}`
        });
    };
};