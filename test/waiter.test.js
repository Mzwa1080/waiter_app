const assert = require('assert');
const Waiter = require('../waiter');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/waiter_test';

const pool = new Pool({
    connectionString
});

describe('The Waiters App', async function () {
    // ----******<(-_-)>-----  Instance -------<(-_-)> *****-
    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query("delete from shifts"),
        await pool.query("delete from employees")
    });
    const waiters = Waiter(pool);

    it('should return All days of the week', async function () {
        const weekdays = await waiters.GetDays();
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

    it('should return "PLEASE SELECT A DAY!" if there\'s no DAY selected', async function(){
       // console.log(await waiters.getShiftsforUser('Mzwa', 'Monday'));
        
       assert.deepEqual(await waiters.getShiftsforUser('Mzwa'), 'Please select a day!');
    })


    it('should return the ID of the user/waiter', async function(){
         await waiters.assignShiftsToWaiter('Mzwa', 'Monday')
        
        // console.log(await waiters.assignShiftsToWaiter('Mzwa', 'Monday'));
         
        // assert.deepEqual(await waiters.assignShiftsToWaiter(), '1');
     })

    after(function () {
        pool.end();
    })
});
