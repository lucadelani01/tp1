import express from "express";
import fs, { write } from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/books", (req, res) => {
  const data = readData();
  res.json(data.books);
});

app.get("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const book = data.books.find((book) => book.id === id);
  res.json(book);
});

app.post("/books", (req, res) => {
  const data = readData();
  const book = req.body;
  const newBook = {
    id: data.books.length + 1,
    ...book,
  };
  data.books.push(newBook);
  writeData(data);
  res.json(newBook);
});

app.put("/books/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const book = req.body;
  const bookIndex = data.books.findIndex((book) => book.id === id);
  data.books[bookIndex] = {
    ...data.books[bookIndex],
    ...book,
  };
  writeData(data);
  res.json({message: "book update succesfully"})
  });

app.delete("/books/:id",(req, res)=>{
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books.splice(bookIndex, 1);
    writeData(data);
    res.json({message: "book deleted succesfully"});
});






app.listen(3000, () => {
  console.log("Server started on port 3000");
});
