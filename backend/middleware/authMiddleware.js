const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "No token provided" });
    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Unauthorized" });
        if (decoded.id <= 0) return res.status(400).json({ error: "Invalid user account" });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;