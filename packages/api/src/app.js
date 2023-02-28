import pkg from 'body-parser';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import initAlertsRouter from './routes/alerts.js';
import initEditionsRouter from './routes/editions.js';
import { AlertsService } from './services/alertsService.js';
import { EditionsService } from './services/editionsService.js';

const { json, urlencoded } = pkg;

// Init App
const initApp = (elasticSearchClient, fcl) => {
  const app = express();

  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(
    initAlertsRouter(
      new AlertsService(elasticSearchClient, fcl)
    )
  );
  app.use(
    initEditionsRouter(
      new EditionsService(elasticSearchClient)
    )
  );

  app.all('/', async (req, res) => {
    return res.send('Welcome to WUPHF For Moments!');
  });

  return app;
};

export default initApp;
