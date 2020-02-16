const express = require('express');
const chalk = require('chalk');
require('./db/mongoose');
const relationRouter = require('./routers/relation');
const beneficiaryRouter = require('./routers/beneficiary');
const userRouter = require('./routers/user');
const bankRouter = require('./routers/bank.router')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(relationRouter);
app.use(beneficiaryRouter);
app.use(userRouter);
app.use(bankRouter)

app.listen(port, () => {
    console.log(chalk.green.inverse('Server in up on port ' + port))
})