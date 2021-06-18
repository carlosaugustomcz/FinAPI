const express = require ("express");
const {v4: uuidv4} = require ("uuid");

const app = express();

app.use(express.json());

const Customers = [];

app.post("/account", (request, response) => {

 const {cpf, name} = request.body;

 const CustomerAlreadyExist = Customers.some(
     (customer) => customer.cpf === cpf);

 if (CustomerAlreadyExist){
     return response.status(401).json({
         error: "Customer already exists!"
     })
 }

 Customers.push({
    cpf,
    name,
    id: uuidv4,
    statement: []
 });

 return response.status(201).json({
     messgae: "account created"});
});

app.get("/statement/", (request, response) => {
    const { cpf } = request.headers;

    const customer = Customers.find((customer) => 
    customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({
            message: "Customer not found!"
        });
    }

    return response.json(customer.statement);
});
app.listen(3333);
console.log('Server Start');