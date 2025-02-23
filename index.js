import app from './app.js';
import config from './src/utilites/config.js';
import logger from './src/utilites/logger.js';


const { port } = config;

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});