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
        await pool.query("delete from employees"),
        await pool.query("delete from shifts");
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

    it('should add the name of the user & assign shifts to them', async function(){
       let insert = await waiters.getShiftsforUser('Mzwa', 'Monday');
       
        console.log(insert);
        
       assert.deepEqual(insert, 'Mzwa');
    })

    after(function () {
        pool.end();
    })
});
