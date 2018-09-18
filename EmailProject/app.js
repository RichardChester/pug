
const express = require('express');
const chalk= require('chalk');
const debug =require('debug');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver').v1;
const logger = require('logger')

var app = express();
const port=process.env.PORT || 3000;


app.use(morgan('tiny'));
app.use('/css', express.static(path.join(__dirname,'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname,'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname,'/public/')));
app.set('views', './src/views');
app.set('view engine','pug');

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '1234567'));
const session = driver.session();

app.get('/',function (req,res) {
    session
        .run('MATCH(n:Movie) RETURN n.title LIMIT 1000')
        .then(function(resultMovie) {
            session
                .run('MATCH(n:Person) RETURN n.name LIMIT 1000')
                .then(function (resultActor) {
                    res.render('tests', {
                        movies: resultMovie.records.map(record => record._fields),
                        actor: resultActor.records.map(record => record._fields)
                    });


                })



        })
        .catch(function (err) {
            console.log(err);
        });

});
app.post('/movies/add', function(req,res) {
    console.log('hello1');
    var title = req.body.title;
    var year = req.body.year;

    session
        .run('CREATE(n:Movie {title:{titleParam},year:{yearParam}}) RETURN n.title',{titleParam:title,yearParam:year })
        .then(function(result){
            console.log(result);

            res.redirect('/');
            console.log('hello');
            session.close();
        })

        .catch(function (err) {
            console.log(err);
        });




});


app.get('/7',function (req,res) {
    res.render('login', {list: [`a`,`b`], title: `MyLibrary`});
});
app.get('/register',function (req,res) {
    res.render('register', {list: [`a`,`b`], title: `MyLibrary`});
});

app.listen(port, () => {
    debug(`listen on port ${chalk.green(port)}`);
});

module.exports = app;

