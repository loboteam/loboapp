import jwt from "jsonwebtoken";

export const verifyServerSession = (authHeader: string | null) => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "samplesecretkey");
        return decoded;
    } catch (e) {
        // Puede lanzar error por expiración (TokenExpiredError) o por manipulación
        return null;
    }
};
