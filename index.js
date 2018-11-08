let express = require('express');
let expressHandlebars = require('express-handlebars');
let bodyParser = require('body-parser');
let flash = require('express-flash');
let session = require('express-session');
const pg = require("pg");
const Pool = pg.Pool;

let Waiter = require('./waiter');
let waiterRoute = require('./routes');

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
  defaultLayout: 'main',
  helpers: {
    "colour": function() {
      if (Object.keys(this.waiters).length < 3) {
        return "white";
      } else if (Object.keys(this.waiters).length === 3) {
        return "green";
      } else {
        return "red";
      }
    }
  }
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

let waiterInstance = Waiter(pool);
let newWaiterRoutes = waiterRoute(waiterInstance);

app.get('/',  newWaiterRoutes.home);

app.post('/waiters', newWaiterRoutes.postRoute);

app.get('/waiters/:worker', newWaiterRoutes.waiters);

//Post For The Button!!!
app.post('/waiters/:username', newWaiterRoutes.waitersForButton);

app.get('/days', newWaiterRoutes.insertToDays);

app.get('/reset', newWaiterRoutes.clear)

let PORT = process.env.PORT || 3012;
app.listen(PORT, () => {
  console.log('App starting on port', PORT);
});
