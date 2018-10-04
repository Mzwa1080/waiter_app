let express = require('express');
let expressHandlebars = require('express-handlebars');
let bodyParser = require('body-parser');
let flash = require('express-flash');
let session = require('express-session');
const pg = require("pg");
const Pool = pg.Pool;


let app = express();

app.use(session({
  secret: 'This line is to display an error message',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
let useSSL = false;
if (process.env.DATABASE_URL) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL ||
  "postgresql://coder:coder123@localhost:5432/waiters_app";

const pool = new Pool({
  connectionString,
  ssl: useSSL
});

app.get('/', function(req, res, next) {
  try {
    res.render('waiter', {

    });

  } catch (err) {
    next(err);
  }

});

app.post('/waiters', function (req, res, next) {
  try {
    res.redirect('/');

  } catch (err) {
    next(err);
  }

});



let PORT = process.env.PORT || 3080;
app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});
