const assert = require('assert');
const Waiter = require('../waiter');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/waiter_test';

const pool = new Pool({
    connectionString
});

describe('The Waiters App', async function(){
// ----******<(-_-)>-----  Instance -------<(-_-)> *****-
    const waiters = Waiter(pool);

    it('should return All days of the week', async function(){

        assert.deepEqual(await waiters.GetDays(),
                                                 [ { id: 1, days: 'Sunday' },
                                                 { id: 2, days: 'Monday' },
                                                 { id: 3, days: 'Tuesday' },
                                                 { id: 4, days: 'Wednesday' },
                                                 { id: 5, days: 'Thursday' },
                                                 { id: 6, days: 'Friday' },
                                                 { id: 7, days: 'Saturday' } ]);
    });

    it('should return a waiter with day(s) of the week', async function(){

      console.log(await waiters.Getusers("Amanda", "Sunday"));

        assert.deepEqual(await waiters.waiter(), 'Amanda');
    });

    after(function(){
        pool.end();
    })
});
