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
    return response.status(200).json({ customer: customer === null || customer === void 0 ? void 0 : customer.statement });
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
    customer === null || customer === void 0 ? void 0 : customer.statement.push(statementOperation);
    return response.status(200).json({ success: customer === null || customer === void 0 ? void 0 : customer.statement });
});
exports.default = route;
