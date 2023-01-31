import express from 'express';
const app = express();
import route from './routes';

app.use(express.json())
app.use(route)

app.listen(8000, () => {
    console.log('Runnirg!!!');
});

