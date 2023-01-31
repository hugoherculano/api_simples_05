import { Request, Response, Router } from 'express';

import { v4 as uuid } from 'uuid';

const route = Router()

type typeClientBank = {
    name: string;
    cpf: string;
    id: string;
    statement: []
}
const customers: typeClientBank[] = [];

route.post('/account', (request: Request, response: Response) => {
    const {
        name,
        cpf
    } = request.body

    const customerAlreadyExist = customers.some(item => item.cpf === cpf);

    if(customerAlreadyExist) {
        return response.status(400).json({ error: 'CPF already exists!'});
    }

    customers.push({
        name,
        cpf,
        statement: [],
        id: uuid()
    });

    return response.status(201).json({ messege: 'OK'});
});

route.get('/statement/:cpf', (request, response) => {
    const { cpf } = request.params;

    const customer = customers.find(item => item.cpf === cpf);

    if(!customer) {
        response.status(400).json({ error: 'CPF not found!'})
    }

    response.status(200).json({ customer: customer?.statement })
})

export default route;