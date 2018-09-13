const express = require('express');
const chalk= require('chalk');
const debug =require('debug');
const morgan = require('morgan');
const path = require('path');

var app = express();
const port=process.env.PORT || 3000;


app.use(morgan('tiny'));
app.use('/css', express.static(path.join(__dirname,'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname,'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname,'/public/')));
app.set('views', './src/views');
app.set('view engine','pug');
app.get('/',function (req,res) {
    res.render('login', {list: [`a`,`b`], title: `MyLibrary`});
});
app.get('/register',function (req,res) {
    res.render('register', {list: [`a`,`b`], title: `MyLibrary`});
});

app.listen(port, () => {
    debug(`listen on port ${chalk.green(port)}`);
});

