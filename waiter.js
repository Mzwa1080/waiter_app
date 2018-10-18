module.exports = function(pool) {

  async function GetDays () {
    let day_names = await pool.query('select * from weekdays');
     day_names = day_names.rows;
    return day_names;
  }

  async function getWeekdays(){
    let days = await pool.query('select * from weekdays');
    return days.rows;
  }

async function waiter(){
  let name = await pool.query('select name from employees');
  name = name.rows;
}

  async function Getusers(textInput, check){
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

  async function getShiftsforUser(user){

      if (user && user !== '') {
          const foundUser = await pool.query('select id from employees where name=$1', [user]);
          if (foundUser.rowCount < 1) {
              return "Not a valid user";
          }
          
          const foundShifts = await pool.query('select day_id from shifts where name_id=$1', [foundUser.rows[0].id]);
          let weekdays = await getWeekdays();
          weekdays.map(day => {
          // for (let day of weekdays) {
            for (let shift of foundShifts.rows) {
              if(shift.day_id === day.id){
                day.checked = 'checked';
              }
            }
            console.log('day', day);
            
          });
          return weekdays;
      }
      return await getWeekdays();
  }

  async function displayWaiters(){
    const results = [];
    let days = await pool.query('select * from weekdays');
    days = days.rows;

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
  }

  async function reset(){
    await pool.query('delete from shifts');
    await pool.query('delete from employees');

  }

return{
  GetDays,
  Getusers,
  displayWaiters,
  reset,
  waiter,
  getWeekdays,
  getShiftsforUser
  }

}
