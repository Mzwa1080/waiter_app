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
    let day_names = await pool.query('select * from weekdays');
    let day_name = day_names.rows;
    // console.log(day_name);

    res.render('waiter', {
      day_name
    });

  } catch (err) {
    next(err);
  }

});

app.post('/waiters', async function(req, res, next) {
  try {
    let textInput = req.body.text;
    let check = req.body.checkbox;
    // console.log(check, "found");
    // console.log(textInput);
    if (textInput === "" || !textInput) {
      req.flash('info', 'empty');
    } else {
      // Converting a string into an array
      if (check && typeof check === 'string') {
        check = [check];
      }



//------------------------------------------------------------------------------------

      let weekdayIds = [];

      let userId = await pool.query('select id from employees where name=$1', [textInput]);
      if (userId.rowCount < 1) {
        await pool.query('insert into employees(name) values ($1)', [textInput]);
        userId = await pool.query('select id from employees where name=$1', [textInput]);
      }


      for (let day of check) {
        let dayId = await pool.query('select id from weekdays where days=$1', [day]);
        if (dayId.rowCount > 0) {
          weekdayIds.push(dayId.rows[0].id);
        }
      }
      

      for (let weekday of weekdayIds) {
        await pool.query('insert into shifts (day_id, name_id) values ($1, $2)', [weekday, userId.rows[0].id])
      }

      // console.log(check);
      // console.log(result);

      // [{
      //   day: 'Monday',
      //   waiters: ['shawn', 'Bani']
      // },{
      //   day: 'Monday',
      //   waiters: ['shawn', 'Bani']
      // }]
    }

    res.render('workers');

  } catch (err) {
    next(err);
  }

});

app.get('/waiters/:worker', async function(req, res, next) {
  try {
    let user = req.params.worker;
    // console.log(user);

    res.render('workers');

  } catch (err) {
    next(err);
  }

});



app.get('/days', async function(req, res, next) {
  try {
    // let user = req.params.worker;
    // console.log(user);

    res.render('listOfWorkers');

  } catch (err) {
    next(err);
  }

});

let PORT = process.env.PORT || 3020;
app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});
