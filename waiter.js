module.exports = function(pool) {

  async function GetDays () {
    let day_names = await pool.query('select * from weekdays');
     day_names = day_names.rows;
    return day_names;
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

return{
  GetDays,
  Getusers
}

}
