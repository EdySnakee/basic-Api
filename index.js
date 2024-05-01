import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// LEER DATA
const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log("error :>> ", error);
  }
};

// ESCRIBIR DATA
const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log("error :>> ", error);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome");
});

// TRAER TODOS LOS USUARIOS
app.get("/users", (req, res) => {
  const data = readData();
  res.send(data.users);
});

// TRAER USUAARIO ID
app.get("/users/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const user = data.users.find((user) => user.id === id);
  res.json(user);
});

// CREAR USUARIO
app.post("/users", (req, res) => {
  const data = readData();
  const body = req.body;
  const newUser = {
    id: data.users.length + 1,
    ...body,
  };
  data.users.push(newUser);
  writeData(data);
  res.json(newUser);
});

// editar USUARIO
app.put("/users/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const userIndex = data.users.findIndex((user) => user.id === id);
  data.users[userIndex] = {
    ...data.users[userIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "Usuario acctualizado" });
});

// ELIMINAR USUARIO
app.delete("/users/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const userIndex = data.users.findIndex((user) => user.id === id);
  data.users.splice(userIndex, 1);
  writeData(data);
  res.json({ message: "Usuario eliminado" });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
