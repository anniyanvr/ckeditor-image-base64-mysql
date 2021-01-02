//Dependencies - Express 4.x and the MySQL Connection
module.exports = (express, connection) => {
    const router = express.Router();

    // Router Middleware
    router.use((req, res, next) => {
        // log each request to the console
        console.log("You have hit the /api", req.method, req.url);

        // Remove powered by header
        //res.set('X-Powered-By', ''); // OLD WAY
        //res.removeHeader("X-Powered-By"); // OLD WAY 2
        // See bottom of script for better way

        // CORS 
        res.header("Access-Control-Allow-Origin", "*"); //TODO: potentially switch to white list version
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        // we can use this later to validate some stuff

        // continue doing what we were doing and go to the route
        next();
    });

    // API ROOT - Display Available Routes
    router.get('/', (req, res) => {
        res.jsonp({
            name: 'Demo API',
            version: '1.0',
            //	        routes: routes // TODO: format this better, after above is fixed
        });

    });

    // Simple MySQL Test
    router.get('/test', (req, res) => {
        let test;

        connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
            if (err) throw err;

            test = rows[0].solution;

            res.jsonp({
                'test': test
            });
        });
    });

    // http://www.restapitutorial.com/lessons/httpmethods.html
    // POST - Create
    // GET - Read
    // PUT - Update/Replace - AKA you pass all the data to the update
    // PATCH - Update/Modify - AKA you just pass the changes to the update
    // DELETE - Delete

    // COLLECTION ROUTES
    router.route('/insertckeditordata')
        //we can use .route to then hook on multiple verbs
        .post((req, res) => {
            const data = req.body.data; // maybe more carefully assemble this data
            console.log(req.body.data);
            const query = connection.query("INSERT INTO mack_shore.area_report_desc (report_description) VALUES ('" + data + "')", (err, result) => {
                if (err) {
                    console.error(err);
                    //res.send("{\"result\" : \"success\"}");
                    res.sendStatus(404);
                } else {
                    res.status(201);
                    res.location('/api/ckeditordata/' + result.insertId);
                    res.end();
                }
            });
            console.log(query.sql);
        })

    .get((req, res) => {
        const query = connection.query('SELECT * FROM mack_shore.area_report_desc', (err, rows, fields) => {
            if (err) console.error(err);

            res.jsonp(rows);
        });
        console.log(query.sql);
    })

    //We do NOT do these to the collection
    .put((req, res) => {
            //res.status(404).send("Not Found").end();
            res.sendStatus(404);
        })
        .patch((req, res) => {
            res.sendStatus(404);
        })
        .delete((req, res) => {
            // LET's TRUNCATE TABLE..... NOT!!!!!
            res.sendStatus(404);
        });
    //end route

    // SPECIFIC ITEM ROUTES
    router.route('/ckeditordata/:id')
        .post((req, res) => {
            //specific item should not be posted to (either 404 not found or 409 conflict?)
            res.sendStatus(404);
        })

    .get((req, res) => {
        const query = connection.query('SELECT * FROM mack_shore.area_report_desc WHERE report_id=?', [req.params.id], (err, rows, fields) => {
            if (err) {
                //INVALID
                console.error(err);
                res.sendStatus(404);
            } else {
                if (rows.length) {
                    res.jsonp(rows);
                } else {
                    //ID NOT FOUND
                    res.sendStatus(404);
                }
            }
        });
        console.log(query.sql);
    })

    .put((req, res) => {
        const data = req.body;
        const query = connection.query('UPDATE mack_shore.area_report_desc SET ? WHERE report_id=?', [data, req.params.id], (err, result) => {
            if (err) {
                console.log(err);
                res.sendStatus(404);
            } else {
                res.status(200).jsonp({ changedRows: result.changedRows, affectedRows: result.affectedRows }).end();
            }
        })
        console.log(query.sql)
    })

    .patch((req, res) => {
        // Need to decide how much this should differ from .put
        //in theory (hmm) this should require all the fields to be present to do the update?
    })

    .delete((req, res) => {
        //LIMIT is somewhat redundant, but I use it for extra sanity, and so if I bungle something I only can break one row.
        const query = connection.query('DELETE FROM mack_shore.area_report_desc WHERE id=? LIMIT 1', [req.params.id], (err, result) => {
            if (err) {
                console.log(err);
                res.sendStatus(404);
            } else {
                res.status(200).jsonp({ affectedRows: result.affectedRows }).end();
            }
        });
        console.log(query.sql)
    });
    //end route

    return router;
};