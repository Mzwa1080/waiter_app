let express = require('express');
let expressHandlebars = require('express-handlebars');
let bodyParser = require('body-parser');
let flash = require('express-flash');
let session = require('express-session');
const pg = require("pg");
const Pool = pg.Pool;

let Waiter = require('./waiter');


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
  "postgresql://coder:coder123@localhost:5432/waiter_app";

const pool = new Pool({
  connectionString,
  ssl: useSSL
});

let WaiterInstance = Waiter(pool);

app.get('/', async function(req, res, next) {
  try {

    res.render('waiter');

  } catch (err) {
    next(err);
  }

});

app.post('/waiters', async function (req, res, next) {
  try {
        let textInput = req.body.text;
        let check = req.body.checkbox;
       console.log(check, "found");
       console.log(textInput);
      if (textInput === "" || !textInput) {
        req.flash('info', 'empty');
      }
      let workers = await WaiterInstance.checkANDInsert(textInput);
      console.log(workers);
    res.render('waiter', {workers});

  } catch (err) {
    next(err);
  }

});

// app.get('/waiters/worker', async function(req, res, next) {
//   try {
//
//     res.render('waiter');
//
//   } catch (err) {
//     next(err);
//   }
//
// });


let PORT = process.env.PORT || 3090;
app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});
