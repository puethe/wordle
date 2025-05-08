import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

app.get("/", (req: Request, res: Response) => {
    const guess = req.query.guess!.toString()
    res.json({"result": checkWord(guess)});
});

const checkWord = (guess: string): boolean => {
    const trueAnswer = "black"
    return guess === trueAnswer
}