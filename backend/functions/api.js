import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import serverless from 'serverless-http';

console.log('Current file:', import.meta.url);
console.log('Directory name:', dirname(fileURLToPath(import.meta.url)));

let app;
try {
  app = await import('../server.js');
  console.log('Server imported successfully');
} catch (error) {
  console.error('Error importing server:', error);
}

const serverlessHandler = serverless(app.default || app);

export const handler = async (event, context) => {
  console.log('Handler called with event:', JSON.stringify(event));
  return await serverlessHandler(event, context);
};