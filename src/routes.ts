import { Request, Response, NextFunction, Router } from 'express';

import { v4 as uuid } from 'uuid';

const route = Router()

interface typeCustomer  {
    name: string;
    cpf: string;
    id: string;
    statement: StatementOperation[]
}

interface StatementOperation {
  description: string;
  amount: number;
  created_at: Date;
  type: string;
}

interface RequestAtData extends Request {
    customer?: typeCustomer;
}

const customers: typeCustomer[] = [];

function verifyIfExistsAccountCPF(request: RequestAtData, response: Response, next: NextFunction) {
    const { cpf } = request.headers;

    const customer = customers.find(item => item.cpf === cpf);

    if(!customer) {
        return response.status(400).json({ error: 'CPF not found!'})
    }

    request.customer = customer;

    return next();
}

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


route.get('/statement', verifyIfExistsAccountCPF, (request: RequestAtData, response: Response) => {
    
    const { customer } = request;

    return response.status(200).json({ customer: customer?.statement });

});

route.post('/deposit', verifyIfExistsAccountCPF, (request: RequestAtData, response: Response) => {
    const { description, amount } = request.body;
    const { customer } = request;

    const statementOperation: StatementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'credit'
    }

    customer?.statement.push(statementOperation);

    return response.status(201).json({ success: 'Deposit completed!' });

})

export default route;