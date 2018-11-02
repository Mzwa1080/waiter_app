module.exports = function(route){

      async function home(req, res, next) {
        try {
          let day_name = await route.getWeekdays();
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
      
      }
      
      async function postRoute(req, res, next) {
        try {
          let textInput = req.body.text;
          let check = req.body.checkbox;
      
      
          if(textInput === "" || textInput === undefined){
            req.flash('info', 'Please insert your name!');
            res.redirect('/');
            return;
          }
      
          if(check === "" || check === undefined){
            req.flash('info', 'Please insert your shist!');
            res.redirect('/');
            return;
          }
      
        
           await route.assignShiftsToWaiter(textInput, check);
          res.redirect('/waiters/' + textInput);
      
        } catch (err) {
          next(err);
        }
      
      }

      async function waiters (req, res, next) {
        try {
          let user = req.params.worker;
          // console.log(user);
          let shifts = await route.getShiftsforUser(user);
          console.log(shifts, "---shifts for user");
          
          // console.log(shifts);
          res.render('workers', {
            shifts,
            user
          });
      
        } catch (err) {
          next(err);
        }
      
      }

      async function insertToDays (req, res, next) {
        try {
          // const day_names = await pool.query('select * from weekdays');
          let days = await route.getWeekdays();
          // console.log(days);
      
          const results = [];
      
          for (let day of days) {
            let waitersResult = await route.insertPerson(day.id);
      
            const waiters = [];
            // waitersResult.rows.map(function(waiter){
            //   console.log('waiter', waiter);
            //   waiters.push(waiter.name);
            // });
      
            for (let waiter of waitersResult) {
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
      
      }
      async function clear (req, res, next) {
        try {
          await route.reset()
      
          res.redirect('/days')
        } catch (err) {
          next(err);
        }
      
      }

      return {
          home,
          postRoute,
          waiters,
          insertToDays,
          clear
      }
}