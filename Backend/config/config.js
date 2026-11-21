const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/glasshouse_pi',
  jwtSecret: process.env.JWT_SECRET || 'glasshouse_secret_key_default',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  chromePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  companyStateCode: process.env.COMPANY_STATE_CODE || '07'
};
