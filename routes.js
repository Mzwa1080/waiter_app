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

      async function daysRoute(req, res, next) {
        try {
          // const day_names = await pool.query('select * from weekdays');
           let days = await route.getWeekdays();
          // console.log(days);
           let results = await route.insertToDays();
            // let shifts = await route.insertToDays();
   
      
          res.render('listOfWorkers', {
            shifts: results,
            dayName: day.days,
            waiters

          });
      
      
        } catch (err) {
          next(err);
        }
      
      }

      return {
          home,
          postRoute,
          waiters,
          daysRoute
      }
}