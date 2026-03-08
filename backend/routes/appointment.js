const express = require("express");
const { getAllAppts, createAppt, getAnAppt, updateAnAppt, deleteAnAppt, getClientsApptHistory } = require("../controllers/appointment");
const router = express.Router();

router.route('/').get(getAllAppts).post(createAppt)

router.route('/:id').get(getAnAppt).patch(updateAnAppt).delete(deleteAnAppt)

router.route('/history/:clientId').get(getClientsApptHistory)

module.exports = router