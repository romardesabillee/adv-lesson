

export default function handler(req, res) {
    if(req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    res.setHeader('Set-Cookie', 'token=token; Path=/; HttpOnly; SameSite=Strict');
    res.status(200).json({ message: 'Cookie set!' });
}