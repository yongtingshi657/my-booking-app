const express = require("express");
const router = express.Router();

const {getAllClients, getClient, createClient, updateClient, deleteClient} = require('../controllers/clients')


router.route('/').get(getAllClients).post(createClient)

router.route('/:id').get(getClient).patch(updateClient).delete(deleteClient)

module.exports = router
