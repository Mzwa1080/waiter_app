module.exports = function (pool) {

  async function getAllWaiters(){
    let all = await pool.query('select name from employees')
    return all.rows;
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
    if (textInput === "" || textInput === undefined) {
      return "Enter your name!";
    }
    console.log('----------------',check);

    // textInput = textInput.charAt(0).toUpperCase() + textInput.slice(1);
 
    
    let userId = await pool.query('select id from employees where name=$1', [textInput]);
    if (userId.rowCount === 0 ) {
      await pool.query('insert into employees(name) values ($1)', [textInput]);
      userId = await pool.query('select id from employees where name=$1', [textInput]);
    }
    let found = await pool.query('select id from shifts where name_id=$1', [ userId.rows[0].id]);

    if(found.rowCount === 0){
     for (let weekday of weekdayIds) {
      await pool.query('insert into shifts (day_id, name_id) values ($1, $2)', [weekday, userId.rows[0].id]);
      
    }
    }

    await pool.query('delete from shifts where name_id=$1', [ userId.rows[0].id])
    // first get previous shifts from database and remove duplicates from the new shifts
    let userShifts = await getShiftsforUser(textInput);
    for (let shift of userShifts) {
      if (shift.checked) {
        let i = check.indexOf(shift.days);
        delete check[i];
      }
    }

    
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

  async function getUsers(){
    let names = await pool.query('select * from employees');
    return names.rows;
  }

  async function getShiftsforUser(user) {
    // user = user.charAt(0).toUpperCase() + user.slice(1);
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
        

      });
      return weekdays;
    }
    return await getWeekdays();
  }
  
  async function insertPerson(day){
  
    let waitersResult = await pool.query(
      'select name from shifts join employees on shifts.name_id=employees.id where day_id=$1', [day]
    )
    return waitersResult.rows;
  }

  
  async function reset() {
    await pool.query('delete from shifts');
    await pool.query('delete from employees');

  }

  async function checkNames(entered){
    let name = await pool.query('select name from shifts join employees on shifts.name_id=employees.id where day_id=$1', [entered]);
    return name.rows;
  }

  return {
    assignShiftsToWaiter,
    // displayWaiters,
    reset,
    waiter,
    getWeekdays,
    getShiftsforUser,
    getAllWaiters,
    insertPerson,
    checkNames,
    getUsers,
    // checkBox
  }

}
