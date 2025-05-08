import express  from 'express'

const app = express();
const port = 3000;
const hostname = "localhost"

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get("/", (req, res) => {
    const guess = req.query.guess
    res.json({"result": checkWord(guess)});
});

const checkWord = (guess) => {
    const trueAnswer = "black"
    return guess === trueAnswer
}