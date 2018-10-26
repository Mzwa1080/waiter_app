module.exports = function(route){

    async function home (req, res, next) {
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
      
      }

      

      return {
          home,
      }
}