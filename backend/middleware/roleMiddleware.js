const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({
                error: `Access denied. Role '${req.userRole}' does not have permission.`
            });
        }
        next();
    };
};

module.exports = authorize;