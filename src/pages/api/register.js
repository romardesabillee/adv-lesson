import { query } from "@/helpers/dbconnection";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Missing fields' });
        return;
    }

    // Check if user exists
    const [row] = await query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    if (row.length > 0) {
        res.status(409).json({ message: 'User already exists' });
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await query(
        "INSERT INTO users (email, password, created_date) VALUES (?, ?, NOW())",
        [email, hashedPassword]
    );

    res.status(200).json({ success: true });
}