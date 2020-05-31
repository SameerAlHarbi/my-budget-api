const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
require('./db/mongoose');

const relationRouter = require('./routers/relation');
const beneficiaryRouter = require('./routers/beneficiary');
const userRouter = require('./routers/user.router');
const bankRouter = require('./routers/bank.router');

const app = express();
const port = process.env.PORT;;

const whitelist = ['http://localhost:4200'];

app.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      if(!origin) return callback(null, true);
      if(whitelist.indexOf(origin) === -1){
        var message = `The CORS policy for this origin dose not 
                       allow access from the particular origin.`;
        return callback(new Error(message), false);
      }
      return callback(null, true);
}}));
    
app.use(express.json());

app.use('/users',userRouter);
app.use('/banks',bankRouter);
app.use(relationRouter);
app.use(beneficiaryRouter);

app.use((req,res,next)=> {
  res.status(404).send();
});

app.listen(port, () => {
    console.log(chalk.green.inverse('Server in up on port ' + port))
});