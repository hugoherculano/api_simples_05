"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const route = (0, express_1.Router)();
const customers = [];
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
route.get('/statement/:cpf', (request, response) => {
    const { cpf } = request.params;
    const customer = customers.find(item => item.cpf === cpf);
    if (!customer) {
        response.status(400).json({ error: 'CPF not found!' });
    }
    response.status(200).json({ customer: customer.statement });
});
exports.default = route;
