module.exports = function (pool) {

  async function InsertPeople(name) {
    let day_names = await pool.query('insert into employees(name) values($1)', [name]);
    day_names = day_names.rows;
    return day_names;
  }

  async function getWeekdays() {
    let days = await pool.query('select * from weekdays');
    return days.rows;
  }

  async function waiter() {
    let name = await pool.query('select name from employees');
    name = name.rows;
    return name.rows;
  }

  async function assignShiftsToWaiter(textInput, check) {
    if (check && typeof check === 'string') {
      check = [check];
    }

    let weekdayIds = [];
    if (textInput === "") {
      return "Enter your name!"
    }

    textInput = textInput.charAt(0).toUpperCase() + textInput.slice(1);
    // console.log("username", textInput);
    
    let userId = await pool.query('select id from employees where name=$1', [textInput]);
    if (userId.rowCount < 1) {
      await pool.query('insert into employees(name) values ($1)', [textInput]);
      userId = await pool.query('select id from employees where name=$1', [textInput]);
    }
    // first get previous shifts from database and remove duplicates from the new shifts
    let userShifts = await getShiftsforUser(textInput);
    for (let shift of userShifts) {
      if (shift.checked) {
        let i = check.indexOf(shift.days);
        delete check[i];
      }
    }
    // console.log('userShift----', userShifts);

    for (let day of check) {
      let dayId = await pool.query('select id from weekdays where days=$1', [day]);
      if (dayId.rowCount > 0) {
        weekdayIds.push(dayId.rows[0].id);
      }
    }
    // now add the new shifts into the database
    for (let weekday of weekdayIds) {
      await pool.query('insert into shifts (day_id, name_id) values ($1, $2)', [weekday, userId.rows[0].id]);
      
    }
    
  }

  async function getShiftsforUser(user) {
    user = user.charAt(0).toUpperCase() + user.slice(1);
    if (user && user !== '') {
      const foundUser = await pool.query('select id from employees where name=$1', [user]);
      if (foundUser.rowCount < 1) {
        return "Please select a day!";
      }

      const foundShifts = await pool.query('select day_id from shifts where name_id=$1', [foundUser.rows[0].id]);
      let weekdays = await getWeekdays();
      weekdays.map(day => {
        // for (let day of weekdays) {
        for (let shift of foundShifts.rows) {
          if (shift.day_id === day.id) {
            day.checked = 'checked';
          }
        }
         console.log('day', day);

      });
      return weekdays;
    }
    return await getWeekdays();
  }

  
  // {
  //   dayName = "Monday"
  //   waiters= ['Mzwa', 'Ben']  
  // }
  
  async function reset() {
    await pool.query('delete from shifts');
    await pool.query('delete from employees');

  }

  return {
    InsertPeople,
    assignShiftsToWaiter,
    // displayWaiters,
    reset,
    waiter,
    getWeekdays,
    getShiftsforUser
  }

}
