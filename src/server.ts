import cors from 'cors';
import express from 'express';
import {sequelize} from './sequelize';

import {IndexRouter} from './controllers/v0/index.router';

import bodyParser from 'body-parser';
import {config} from './config/config';
import {V0_FEED_MODELS} from './controllers/v0/model.index';


(async () => {
  await sequelize.addModels(V0_FEED_MODELS);


  console.debug("Initialize database connection...");
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080;

  app.use(bodyParser.json());

  // We set the CORS origin to * so that we don't need to
  // worry about the complexities of CORS this lesson. It's
  // something that will be covered in the next course.
  app.use(cors({
    allowedHeaders: [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    origin: '*',
  }));

  app.use('/api/v0/', IndexRouter);

  // Root URI call
  app.get( '/', async ( req, res ) => {
    res.send( '/api/v0/' );
  } );


  console.log("#####");
  console.log("process.env: " + process.env);
  console.log("#####");
  console.log(
      "username: " + process.env.POSTGRES_USERNAME + "___" +
      "password: " + process.env.POSTGRES_PASSWORD + "___" +
      "database: " + process.env.POSTGRES_DATABASE + "___" +
      "port: " + process.env.POSTGRES_PORT + "___" +
      "host: " + process.env.POSTGRES_HOST + "___" +
      "dialect: " + process.env.POSTGRES_DIALECT + "___" +
      "aws_region: " + process.env.AWS_REGION + "___" +
      "aws_profile: " + process.env.AWS_PROFILE + "___" +
      "aws_media_bucket: " + process.env.AWS_MEDIA_BUCKET
  );


  // Start the Server
  app.listen( port, () => {
    console.log( `server running ${config.url}` );
    console.log( `press CTRL+C to stop server` );
  } );
})();
