const express = require('express');
   const serverless = require('serverless-http');
   const app = require('../server'); // Adjust this path if necessary

   const handler = serverless(app);

   module.exports.handler = async (event, context) => {
     return await handler(event, context);
   };