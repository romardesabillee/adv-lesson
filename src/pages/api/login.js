import { query } from "@/helpers/dbconnection";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    const { email, password } = req.body;

    // Get user by email
    const [row] = await query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    const [user] = row;

    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const token = await generateUniqueToken();
    const oneDay = 24 * 60 * 60 * 1000;
    const expiresDate = new Date(Date.now() + oneDay);
    const expires = expiresDate.toUTCString();

    await query(
        "UPDATE users SET token = ?, token_expiration = ? WHERE email = ?",
        [token, expiresDate, email]
    );

    res.setHeader(
        'Set-Cookie',
        `token=${token}; Path=/; Expires=${expires}; HttpOnly; SameSite=Strict`
    );

    res.status(200).json({ message: 'Login successful' });
}


async function generateUniqueToken() {
    let isUnique = false;
    let token = '';

    while (!isUnique) {
        token = crypto.randomBytes(16).toString("hex");
        const [rows] = await query(
            "SELECT * FROM users WHERE token = ?",
            [token]
        );
        if (rows.length === 0) {
            isUnique = true;
        }
    }

    return token;
}