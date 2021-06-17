const express = require ("express");
const {v4: uuidv4} = require ("uuid");

const app = express();

app.use(express.json());

const Customers = [];

app.post("/account", (request, response) => {

 const {cpf, name} = request.body;

 const id = uuidv4;

 Customers.push({
    cpf,
    name,
    id,
    statement: []
 });

 response.status(201).send("Conta Criada");
 console.log(Customers);
});

app.listen(3333);
console.log('Server Start');