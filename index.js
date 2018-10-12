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

app.get('/', async (req, res, next) => {
  try {
    let day_names = await pool.query('select * from weekdays');
    let day_name = day_names.rows;
    // console.log(day_name);
    if (req.session.worker) {
      res.redirect('/');
    }
    res.render('waiter', {
      day_name
    });

  } catch (err) {
    next(err);
  }

});

app.post('/waiters', async (req, res, next) => {
  try {
    let textInput = req.body.text;
    let check = req.body.checkbox;

    if (textInput === "" || !textInput) {
      req.flash('info', 'empty');
    } else {
      // Converting a string into an array
      if (check && typeof check === 'string') {
        check = [check];
      }

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
    }
    res.redirect('/waiters/' + textInput);

  } catch (err) {
    next(err);
  }

});

app.get('/waiters/:worker', async (req, res, next) => {
  try {
    let user = req.params.worker;

    let selectUser = await pool.query('select days from weekdays');
    let users = selectUser.rows;
    // console.log(users);
    res.render('workers', {
      users,
      user
    });

  } catch (err) {
    next(err);
  }

});



app.get('/days', async (req, res, next) => {
  try {
    const day_names = await pool.query('select * from weekdays');
    let days = day_names.rows;

    const results = [];

    for (let day of days) {
      let waitersResult = await pool.query(
        'select name from shifts join employees on shifts.name_id=employees.id where day_id=$1', [day.id]
      );

      const waiters = [];
      // waitersResult.rows.map(function(waiter){
      //   console.log('waiter', waiter);
      //   waiters.push(waiter.name);
      // });

      for (let waiter of waitersResult.rows) {
        waiters.push(waiter.name);
      }

      results.push({
        dayName: day.days,
        waiters
      })
    }

    console.log("shifts", results);

    res.render('listOfWorkers', {
      shifts: results
    });


  } catch (err) {
    next(err);
  }

});

let PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
  console.log('App starting on port', PORT);
});
