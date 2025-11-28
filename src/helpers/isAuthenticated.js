import { query } from "@/helpers/dbconnection";

export async function isAuthenticated(req, res) {
    const token = req.cookies.token;
    const expiredDate = new Date(0).toUTCString();

    if (!token) {
        res.setHeader('Set-Cookie', `token=; Path=/; Expires=${expiredDate}; HttpOnly; SameSite=Strict`);
        res.writeHead(302, { Location: '/login' });
        res.end();
        return null;
    }

    const user = await query(
        "SELECT * FROM users WHERE token = ? AND token_expiration > NOW()",
        [token]
    );

    if (!user || (Array.isArray(user) && user.length === 0)) {
        res.setHeader('Set-Cookie', `token=; Path=/; Expires=${expiredDate}; HttpOnly; SameSite=Strict`);
        res.writeHead(302, { Location: '/login' });
        res.end();
        return null;
    }

    return user;
}