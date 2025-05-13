import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger_output.json';
import { errorHandler, router } from './routes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/', router);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Open API server running at http://localhost:${PORT}/doc`);
});
