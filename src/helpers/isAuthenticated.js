import { query } from "@/helpers/dbconnection";

export async function isAuthenticated(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return redirectToLogin(res);
    }

    // // is token exist
    const [user] = await query(
        "SELECT * FROM users WHERE token = ?",
        [token]
    );
    if (user.length === 0) 
        return expired(res);

    // is expired
    const [row] = await query(
        "SELECT * FROM users WHERE token = ? AND NOW() > token_expiration",
        [token]
    );
    console.log('test');
    if (row.length) 
        return expired(res);

    return user[0];
}

function expired(res) {
    const expiredDate = new Date(0).toUTCString();
    res.setHeader('Set-Cookie', `token=; Path=/; Expires=${expiredDate}; HttpOnly; SameSite=Strict`);
    res.status(401).json({ message: "Session expired. Please log in again." });
    return null;
}