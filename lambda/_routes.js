const createAlias = require('./modules/createAlias.js');
const deleteAlias = require('./modules/deleteAlias.js');
const editAlias = require('./modules/editAlias.js');
const searchForAlias = require('./modules/searchForAlias.js');
const listAliases = require('./modules/listAliases.js');

const { DB_HOST, DB_NAME } = process.env;
const router = express.Router();

router.route('/')
  .get((req,res) => {
    res.end('nothing to see here')
  })
  .post((req,res) => {
    res.end('nothing to see here')
  });

router.route('/new')
  .post((req,res) =>{
    createAlias.createAlias(body, callback);

  });

router.route('/delete')
  .post((req,res) =>{
    deleteAlias.deleteAlias(body, callback);
    
  });

router.route('/edit')
  .post((req,res) =>{
    editAlias.editAlias(body, callback);

  });

router.route('/list')
  .post((req,res) =>{
    listAliases.listAliases(body, callback, event);
 
  });

router.route('/search')
  .post((req,res) =>{
    searchForAlias.searchForAlias(body, callback);
  });

/**
 * This array is used to match the endpoint path. Each entry contains
 * the route to match, the methods we allow, the function to run,
 * the collection name to query on (if applicable)
 */
module.exports = router;