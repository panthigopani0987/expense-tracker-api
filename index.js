const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

//env file and database connection
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/uploads', express.static('uploads'));

//routes
app.use('/api/auth',authRoutes);
app.use('/api/expenses',expenseRoutes);

//error handling
const errorMiddleware = require('./middlewares/errorMiddleware');
app.use(errorMiddleware);

//start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));