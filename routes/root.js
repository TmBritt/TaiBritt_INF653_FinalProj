const express = require('express');
const router = express.Router();
const path = require('path');


//respond to get get request on home page
// specify the root directory with { root: __dirname }
// can use regex in get method with express. in This case we are saying
// the route mus begin and end with / OR be index.html with '.html' as optional
// also, express automatically sets contenttype and status code
// Important note, express handle routes like a waterfall
router.get('^/$|index(.html)?', (req, res) => {
    //res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;