import { query } from "@/helpers/dbconnection";

export default async function handler(req, res) {
    switch (req.method) {
        case "GET":
            await getTodos(req, res);
            break;
        case "POST":
            await createTodo(req, res);
            break;
        default:
            res.status(405).json({ message: "Method not allowed" });
    }
}

async function getTodos(req, res) {
    const [rows] = await query("SELECT * FROM todos ORDER BY id DESC");
    res.status(200).json(rows);
}

async function createTodo(req, res) {
    const { text } = req.body;
    if (!text) {
        res.status(400).json({ message: "Text is required" });
        return;
    }
    await query("INSERT INTO todos (text) VALUES (?)", [text]);
    res.status(201).json({ message: "Todo added" });
}