const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Appointment = require("../models/Appointment");

const getAllAppts = async (req, res) => {
  // define a range for getting appoinments
  const { startDate, endDate } = req.query;

  if (!startDate && !endDate) {
    throw new BadRequestError(
      "Please provide Date Range for both startDate and endDate",
    );
  }

  let queryObject = { createdBy: req.user.userId };

  if (startDate && endDate) {
    queryObject.start = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  console.log(queryObject);
  const appointments = await Appointment.find(queryObject).sort("start");
  res.status(StatusCodes.OK).json({ appointments, count: appointments.length });
};

const createAppt = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const appointment = await Appointment.create(req.body);
  res.status(StatusCodes.CREATED).json({ appointment });
};

const getAnAppt = async (req, res) => {
  const {
    user: { userId },
    params: { id: apptId },
  } = req;

  const appointment = await Appointment.findOne({
    _id: apptId,
    createdBy: userId,
  });

  if (!appointment) {
    throw new NotFoundError(`No Appointment with id ${apptId} `);
  }

  res.status(StatusCodes.OK).json({ appointment });
};
const updateAnAppt = async (req, res) => {
    const {
        body: { start, end, clientName, clientId},
        user: { userId },
        params: { id: apptId },
      } = req;
    
      if (start === "" || end === "" || clientId === "" ||clientName === "") {
        throw new BadRequestError("Please fill in all the fields");
      }
    
      const appointment = await Appointment.findOneAndUpdate(
        {
          _id: apptId,
          createdBy: userId,
        },
        req.body,
        { returnDocument: "after", runValidators: true },
      );
    
      if (!appointment) {
        throw new NotFoundError(`No Appointment with id ${apptId} `);
      }
      res.status(StatusCodes.OK).json({ appointment });
};
const deleteAnAppt = async (req, res) => {
  const {
      user: { userId },
      params: { id: apptId },
    } = req;
  
    const appointment = await Appointment.findByIdAndDelete({
      _id: apptId,
      createdBy: userId,
    });
  
    if (!appointment) {
      throw new NotFoundError(`No Appointment with id ${apptId} `);
    }
    res.status(StatusCodes.OK).json({ message: "Appointment deleted" });
};

const getClientsApptHistory = async (req, res) => {
    const {
    user: { userId },
    params: { clientId},
  } = req;

  const clientApptHistory = await Appointment.find({
    clientId: clientId,
    createdBy: userId,
  }).sort("-start")

  if (!clientApptHistory || clientApptHistory.length === 0) {
    return res.status(StatusCodes.OK).json({ 
      message: "No appointment history found for this client.",
      clientApptHistory: [] 
    });
  }

  res.status(StatusCodes.OK).json({ clientApptHistory });
}

module.exports = {
  getAllAppts,
  createAppt,
  getAnAppt,
  updateAnAppt,
  deleteAnAppt,
  getClientsApptHistory
};


