const assert = require('assert');
const Waiter = require('../waiter');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/waiter_test';

const pool = new Pool({
    connectionString
});

describe('The Waiters App', async function () {
    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query("delete from shifts"),
        await pool.query("delete from employees")
    });
    const waiters = Waiter(pool);


    it('should return "PLEASE SELECT A DAY!" if there\'s no DAY selected', async function(){
        
       assert.deepEqual(await waiters.getShiftsforUser('Mzwa'), 'Please select a day!');
    })

    it('should return "ENTER YOUR NAME" if there\'s no name entered',async function(){
       await waiters.assignShiftsToWaiter();
        
        assert.deepEqual("Enter your name!", await waiters.assignShiftsToWaiter());
    })

    it('should return 7 days for everyday of the week', async function (){

        let getDays = await waiters.getWeekdays()
        getDays = getDays.length;
        // console.log(getDays)

        assert.equal(7, getDays);
     })


    it('should return All days of the week', async function () {
        const weekdays = await waiters.getWeekdays();
        for (let day of weekdays) {
            delete day.id;
        }

        assert.deepEqual(weekdays,
            [{ days: 'Sunday' },
            { days: 'Monday' },
            { days: 'Tuesday' },
            { days: 'Wednesday' },
            { days: 'Thursday' },
            { days: 'Friday' },
            { days: 'Saturday' }]);
    });


    it('should return Checked/Selected days', async function(){
         insertNameAndDay = await waiters.assignShiftsToWaiter('Mzwa', ['Monday', 'Tuesday'])
        //  console.log('names & days ----', insertNameAndDay);
         
         let user = await waiters.getShiftsforUser('Mzwa')
         let expectedDay = [ { id: 1, days: 'Sunday' },
         { id: 2, days: 'Monday', checked: 'checked' },
         { id: 3, days: 'Tuesday', checked: 'checked' },
         { id: 4, days: 'Wednesday' },
         { id: 5, days: 'Thursday' },
         { id: 6, days: 'Friday' },
         { id: 7, days: 'Saturday' } ];

        //  console.log(user);
        
         assert.deepEqual(expectedDay, user );
     })

     it('should return the total number of waiters ', async function (){
        await waiters.assignShiftsToWaiter('Mzwa', 'Wednesday');
        await waiters.assignShiftsToWaiter('Ben', 'Saturday')
        let waiter2 = await waiters.getAllWaiters('Mzwa')
        
        // console.log(await waiters.getAllWaiters('Mzwa').length );
        
        console.log('', waiter2.length);

        assert.equal(2, waiter2.length)
     })

    after(function () {
        pool.end();
    })
});


// 98