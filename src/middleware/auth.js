export const verifyToken = async (req, reply) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reply.status(401).send({ message: "Authorization header missing or invalid" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = decoded;

        return true; // Successfully verified
    } catch (err) {
        console.error("Token verification error:", err.message); // Log detailed error
        if (err.name === "TokenExpiredError") {
            return reply.status(403).send({ message: "Token expired. Please log in again." });
        } else if (err.name === "JsonWebTokenError") {
            return reply.status(403).send({ message: "Invalid token. Access denied." });
        } else {
            return reply.status(403).send({ message: "Unauthorized access" });
        }
    }
};
