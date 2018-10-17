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
  defaultLayout: 'main',
  helpers: {
    "colour": function() {
      if (Object.keys(this.waiters).length === 0) {
        return "white";
      } else if (Object.keys(this.waiters).length === 3) {
        return "green";
      } else if (Object.keys(this.waiters).length < 3) {
        return "blue";
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

app.get('/', async (req, res, next) => {
  try {
    let day_name = await waiterInstance.GetDays();
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
    }
    await waiterInstance.Getusers(textInput, check);
    res.redirect('/waiters/' + textInput);

  } catch (err) {
    next(err);
  }

});

app.get('/waiters/:worker', async (req, res, next) => {
  try {
    let user = req.params.worker;

    let users = await waiterInstance.GetDays();

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
    // const day_names = await pool.query('select * from weekdays');
    let days = await waiterInstance.GetDays();
    // console.log(days);

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

app.get('/reset', async (req, res, next) => {
  try {
    await waiterInstance.reset()

    res.render('listOfWorkers')
  } catch (err) {
    next(err);
  }

})

let PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
  console.log('App starting on port', PORT);
});
