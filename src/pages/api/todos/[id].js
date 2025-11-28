import { query } from "@/helpers/dbconnection";
import { isAuthenticated } from "@/helpers/isAuthenticated";

export default async function handler(req, res) {

    switch (req.method) {
        case "DELETE":
            await deleteTodo(req, res);
            break;
        case "PUT":
            await updateTodo(req, res);
            break;
        default:
            res.status(405).json({ message: "Method not allowed" });
    }
}

async function deleteTodo(req, res) {
    const { id } = req.query;

    if (req.method === "DELETE") {
        if (!id) {
            res.status(400).json({ message: "ID is required" });
            return;
        }
        await query("DELETE FROM todos WHERE id = ?", [id]);
        res.status(200).json({ message: "Todo deleted" });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}

async function updateTodo(req, res) {
    const { id } = req.query;
    const { text } = req.body;

    if (!text) {
        res.status(400).json({ message: "Text are required" });
        return;
    }
    await query("UPDATE todos SET text = ? WHERE id = ?", [text, id]);
    res.status(200).json({ message: "Todo updated" });
}