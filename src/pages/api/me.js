import { query } from "@/helpers/dbconnection";

export default async function handler(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ user: null });
    }

    const [user] = await query(
        "SELECT id, email, created_date FROM users WHERE token = ? AND token_expiration > NOW()",
        [token]
    );

    if (user.length === 0) {
        return res.status(401).json({ user: null });
    }

    res.status(200).json(...user);
}