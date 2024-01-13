const app = require('./app');
require('dotenv').config();


app.listen(process.env.PORT, () => {
  console.log('CORS-enabled web server listening on port 1234....');
});
