const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
},(e) => {
    if(e) {
        return console.log(chalk.red.inverse('Database connection error! ' + e.message));
    }
    console.log(chalk.gray.inverse('Database connection succeded!'))
});