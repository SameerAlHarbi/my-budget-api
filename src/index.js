const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
require('./db/mongoose');

const relationRouter = require('./routers/relation');
const beneficiaryRouter = require('./routers/beneficiary');
const userRouter = require('./routers/user.router');
const bankRouter = require('./routers/bank.router');

const app = express();
const port = process.env.PORT;// || 3000;

const multer = require('multer');
const upload = multer({
  dest: './images',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req,file,cb) {


    // if(!file.originalname.endsWith('.pdf')) {
    //   return cb(new Error('Please upload a PDF'));
    // }
    
    if(!file.originalname.mstch(/\.(doc|docx)$/)) {
      return cb(new Error('Please upload a Word document'));
    }

    return cb(undefined, true);

    //cb(new Error('File must be PDF'));
    //cb(undefined, true);
    //cb(undefined, false);//sliently reject the file
  }
});

// const errorMiddleware = (req,res, next) => {
//   throw new Error('Error from my middleware');
// }

// app.post('/upload', upload.single('upload'),(req, res) => {
//   res.send();
// });

// app.post('/upload', errorMiddleware,(req, res) => {
//   res.send();
// }, (error,req, res, next) => {
//   res.status(400).send({error: error.message});
// });

// app.post('/upload',  upload.single('upload'),(req, res) => {
//   res.send();
// }, (error,req, res, next) => {
//   res.status(400).send({error: error.message});
// });

const whitelist = ['http://localhost:4200', 'http://abc.com'];

app.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      if(!origin) return callback(null, true);
      if(whitelist.indexOf(origin) === -1){
        var message = 'The CORS policy for this origin dose not ' +
                  'allow access from the particular origin.';
        return callback(new Error(message), false);
      }
      return callback(null, true);
}}));
    
app.use(express.json());
app.use(relationRouter);
app.use(beneficiaryRouter);
app.use(userRouter);
app.use(bankRouter);

app.listen(port, () => {
    console.log(chalk.green.inverse('Server in up on port ' + port))
});