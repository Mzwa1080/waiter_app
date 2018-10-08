module.exports = function(pool) {

  async function checkANDInsert(textInput,check) {
    let userData = await pool.query('select * from employees where name=$1', [textInput]);
    let userArray = userData.rows;
    if (userArray.length === 0) {
        await pool.query('insert into employees(name) values($1)', [textInput]);
        // let days=  await pool.query('select * from weekdays');
        // days = days.rows;
        let user = await pool.query('select * from employees where name=$1', [textInput]);
        user = user.rows;
        // console.log(user);
        for (var i = 0; i < check.length; i++) {
          let dayData = await pool.query('select * from weekdays where days=$1',[check[i]]);
          dayData = dayData.rows;
          await pool.query('insert into shifts(day_id,name_id) values($1,$2)', [dayData[0].id,user[0].id]);
        }
    }
    else {
      let waiter = await pool.query('insert into employees(name) values($1)', [textInput]);

    }
  }

  async function getPeople(){
   await pool.query('select num_of_days from availability');
  }

  /*For Text Input I must have a text input function that gets the name & insert it on Employees Table!

  --++--

  */

  return {
    checkANDInsert,
    getPeople
  }
}
