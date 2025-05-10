import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Wordle API',
        description: 'API for a re-implementation of the Wordle game in NodeJS'
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);
