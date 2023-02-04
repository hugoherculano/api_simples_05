"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const route = (0, express_1.Router)();
const customers = [];
function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;
    const customer = customers.find(item => item.cpf === cpf);
    if (!customer) {
        return response.status(400).json({ error: 'CPF not found!' });
    }
    request.customer = customer;
    return next();
}
function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === 'credit') {
            return acc + operation.amount;
        }
        else {
            return acc - operation.amount;
        }
    }, 0);
    return balance;
}
route.post('/account', (request, response) => {
    const { name, cpf } = request.body;
    const customerAlreadyExist = customers.some(item => item.cpf === cpf);
    if (customerAlreadyExist) {
        return response.status(400).json({ error: 'CPF already exists!' });
    }
    customers.push({
        name,
        cpf,
        statement: [],
        id: (0, uuid_1.v4)()
    });
    return response.status(201).json({ messege: 'OK' });
});
route.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    if (!customer) {
        return response.status(400).json({ error: 'Invalid customer data' });
    }
    return response.status(200).json({ customer: customer.statement });
});
route.post('/deposit', verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;
    const { customer } = request;
    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'credit'
    };
    if (!customer) {
        return response.status(400).json({ error: 'Invalid customer data' });
    }
    customer.statement.push(statementOperation);
    return response.status(201).json({ success: 'Deposit completed!' });
});
route.post('/withdraw', verifyIfExistsAccountCPF, (request, response) => {
    const { amount } = request.body;
    const { customer } = request;
    if (!customer) {
        return response.status(400).json({ error: 'Invalid customer data' });
    }
    const balance = getBalance(customer.statement);
    if (balance < amount) {
        return response.status(400).json({ error: 'Insufficient funds!' });
    }
    const statementOperation = {
        amount,
        created_at: new Date(),
        type: 'debit'
    };
    customer.statement.push(statementOperation);
    return response.status(201).json({ success: 'Withdraw completed!' });
});
route.get('/statement/date', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    const { date } = request.query;
    const dateFormat = new Date(date + ' 00:00');
    if (!customer) {
        return response.status(400).json({ error: 'Invalid customer data' });
    }
    const statement = customer.statement.filter((statement) => {
        return statement.created_at.toDateString() === new Date(dateFormat).toDateString();
    });
    return response.status(200).json(statement);
});
exports.default = route;
