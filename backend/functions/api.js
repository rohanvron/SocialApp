import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import serverless from 'serverless-http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = resolve(__dirname, '..', 'server.js');

let app;
import(serverPath)
  .then((module) => {
    app = module.default || module;
    console.log('Server imported successfully');
  })
  .catch((error) => {
    console.error('Error importing server:', error);
  });

const serverlessHandler = serverless((req, res) => {
  if (app) {
    app(req, res);
  } else {
    res.status(500).send('Server not initialized');
  }
});

export const handler = async (event, context) => {
  console.log('Handler called with event:', JSON.stringify(event));
  return await serverlessHandler(event, context);
};