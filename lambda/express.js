'use strict';
const port = process.env.PORT || 6060;
const app = require('./server');
app.listen(port, () => console.log(`listening on port ${port}`));