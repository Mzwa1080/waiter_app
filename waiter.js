module.exports = function(pool) {

  // async function iinsert(names, checkbox) {
  //   let userData = await pool.query('select * from employees where name=$1', [names]);
  //   // console.log(userId);
  //   if (userData.rows === 0) {
  //     await pool.query('insert into employees(name) values($1)', [names]);
  //   }
  //   userData = await
  //   let userArray = userData.rows;
  //   console.log(userArray);
  //   // let userId = userData.rows[0].id;
  //
  //   if (userArray.length === 0) {
  //     await pool.query('insert into employees(name) values($1)', [names]);
  //     // let days=  await pool.query('select * from weekdays');
  //     // days = days.rows;
  //     let user = await pool.query('select * from employees where name=$1', [names]);
  //     user = user.rows;
  //     // console.log(user);
  //     for (var i = 0; i < checkbox.length; i++) {
  //       let dayData = await pool.query('select * from weekdays where days=$1', [checkbox[i]]);
  //       dayData = dayData.rows;
  //       await pool.query('insert into shifts(day_id,name_id) values($1,$2)', [dayData[0].id, user[0].id]);
  //     }
  //   }
  //   // let userData = await pool.query('select id from employees where name=$1', [name]);
  //   userId = userData.rows[0].id;
  //   console.log(userId);
  //   let result = await pool.query('select days from weekdays join employees on weekdays.id=employees.id join shifts on shifts.id=weekdays.id where shifts.day_id=$1', [userId])
  //   // let joinedDays = result.rows;
  //   return result.rows;
  //   console.log(result);
  //
  //   for (weekdays of checkbox) {
  //     for (selectedDays of result) {
  //       if (checkbox.days === result.days) {
  //
  //       }
  //     }
  //   }
  //   console.log(checkbox);
  //   console.log(result);
  //
  // }
  //
  // async function getDayName(name) {
  //   iinsert(name);
  //   let userData = await pool.query('select id from employees where name=$1', [name]);
  //   userId = userData.rows;
  //   let result = await pool.query('select days from weekdays join employees on weekdays.id=employees.id join shifts on shifts.id=weekdays.id where shifts.day_id=$1', [userId])
  //   // let joinedDays = result.rows;
  //   return result.rows;
  //   console.log(result);
  // }
  //
  // return {
  //   getDayName,
  //   iinsert
  // }
}
