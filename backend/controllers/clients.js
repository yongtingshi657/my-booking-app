const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Client = require("../models/Client");
const Appointment = require("../models/Appointment");

const getAllClients = async (req, res) => {
  const clients = await Client.find({ createdBy: req.user.userId }).sort(
    "createdAt",
  );
  res.status(StatusCodes.OK).json({ clients, count: clients.length });
};

const createClient = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const client = await Client.create(req.body);
  res.status(StatusCodes.CREATED).json({ client });
};

const getClient = async (req, res) => {
  const {
    user: { userId },
    params: { id: clientId },
  } = req;

  const client = await Client.findOne({
    _id: clientId,
    createdBy: userId,
  });

  if (!client) {
    throw new NotFoundError(`No Client with id ${clientId} `);
  }

  res.status(StatusCodes.OK).json({ client });
};

const updateClient = async (req, res) => {
  const {
    body: { firstname, lastname, email, phone },
    user: { userId },
    params: { id: clientId },
  } = req;

  const newFullName = `${firstname} ${lastname}`;

  if (firstname === "" || lastname === "" || email === "" || phone === "") {
    throw new BadRequestError("Please fill in all the fields");
  }

  const client = await Client.findOneAndUpdate(
    {
      _id: clientId,
      createdBy: userId,
    },
    req.body,
    { returnDocument: "after", runValidators: true },
  );

  await Appointment.updateMany(
    { clientId: clientId }, 
    { $set: { clientName: newFullName } }
  );
  
  if (!client) {
    throw new NotFoundError(`No Client with id ${clientId} `);
  }
  res.status(StatusCodes.OK).json({ client });
};
const deleteClient = async (req, res) => {
  const {
    user: { userId },
    params: { id: clientId },
  } = req;

  const linkedAppts = await Appointment.findOne({
    clientId,
    createdBy: userId,
  });
  if (linkedAppts) {
    throw new BadRequestError(
      "Cannot delete client. They have existing appointments. Please delete their appointments first.",
    );
  }
  const client = await Client.findByIdAndDelete({
    _id: clientId,
    createdBy: userId,
  });

  if (!client) {
    throw new NotFoundError(`No Client with id ${clientId} `);
  }
  res.status(StatusCodes.OK).json({ message: "Client deleted" });
};

const searchClients = async (req, res) => {
  const { searchQuery } = req.query;
  const userId = req.user.userId;

  if (!searchQuery) {
    return res
      .status(StatusCodes.OK)
      .json({ message: "Client does not exist", client: [] });
  }

  const clients = await Client.find({
    createdBy: userId,
    $or: [
      { firstname: { $regex: searchQuery, $options: "i" } },
      { lastname: { $regex: searchQuery, $options: "i" } },
      { phone: { $regex: searchQuery, $options: "i" } },
    ],
  });

  res.status(StatusCodes.OK).json({ clients });
};

module.exports = {
  getAllClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
};
