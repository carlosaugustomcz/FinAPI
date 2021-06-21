const { request, response } = require("express");
const express = require ("express");
const {v4: uuidv4} = require ("uuid");

const app = express();

app.use(express.json());

const Customers = [];

// Midlleware
function verifyIfExistsAccountCPF(request, response, next) {

    const { cpf } = request.headers;

    const customer = Customers.find((customer) => 
    customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({
            message: "Customer not found!"
        });
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === 'credit') {
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        }
    }, 0); 

    return balance;

}

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
     message: "account created"});
});

app.get("/statement/", verifyIfExistsAccountCPF, (request, response) => {
   
    const { customer } = request;

    return response.json(customer.statement);
});

app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request.customer;
    const { date } = request.headers;
    console.log(date);

    console.log(customer);
    
    const dataFormat= new Date(date + " 00:00");

    const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString())

    return response.json(customer.statement);
})

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"

    }

    customer.statement.push(statementOperation);

    return response.status(201).json({
        message: "deposit created!"
    });
});

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
    const { amount } = request.body;

    const { customer } = request;

    const balance = getBalance(customer.statement); 

    if (balance < amount) {
        return response.status(400).json({
            message: "Insuficient founds!"
        });
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "credit"

    }

    customer.statement.push(statementOperation);

    return response.status(201).json({
        message: "sucess"
    });


})

app.listen(3333);
console.log('Server Start');