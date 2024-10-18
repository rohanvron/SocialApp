import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import serverless from 'serverless-http';
import app from '../server.js';

const currentFilePath = fileURLToPath(import.meta.url);
console.log('Current file:', currentFilePath);
console.log('Directory name:', dirname(currentFilePath));

console.log('Server imported successfully');

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  console.log('Handler called with event:', JSON.stringify(event));
  return await serverlessHandler(event, context);
};