import jwt from "jsonwebtoken";

// middleware to verify token
export const verifyToken = async (req, res, next) => {

    try {
        let token = req.header("Authorization");
        
        // checking if token is present
        if (!token) {
            return res.status(403).send("Access Denied");
        }

        // removing the "Bearer " prefix from the token
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        // verifying the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // calling the next middleware

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}