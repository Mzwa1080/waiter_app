module.exports = function(pool){

function checkWaiterName(person, day){
  if (!person || person== '') {
    return "Enter your name!";

  }
  person = text.toUpperCase();
  let checkBox = await pool.query('select id from weekdays where days=$1', [person]);
  if (checkBox.rows.length === 0) {
      checkBox = await pool.query('insert into availability(num_of_days) values($1)', [checkbox.rows[0].id])
  }
  return "Doesn\'t exist!"
}

/*For Text Input I must have a text input function that gets the name & insert it on Employees Table!

--++--

*/

return {
  checkWaiterName,
  }
}
