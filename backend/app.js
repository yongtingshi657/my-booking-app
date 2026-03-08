const express = require("express");
const app = express();
require("dotenv").config();
// import
const connectDB = require("./db/connect");
const authRouter = require('./routes/auth'); 
const clientRouter = require('./routes/client'); 
const apptRouter = require('./routes/appointment'); 
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticateUser = require('./middleware/authentication')

// middleware 
app.use(express.json());

// routes
app.use('/api/auth', authRouter )
app.use('/api/clients', authenticateUser, clientRouter)
app.use('/api/appointments', authenticateUser, apptRouter)

// error handler
app.use(errorHandlerMiddleware)
app.use(notFound)


const PORT = process.env.PORT || 3500;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connect to MongoDB");

    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
