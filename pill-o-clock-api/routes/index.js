const { Router } = require('express')
const {
    registerUser,
    authenticateUser,
    retrieveUser,
    deleteMedication,
    retrievePrescriptedMedication,
    addPrescription,
    retrievePrescription,
    deletePrescription,
    addProgress,
    retrieveProgress,
    retrieveDrug,
    retrieveContacts,
    addContact,
    retrieveDrugs,
    addProgressRecord,
    retrieveProgressRecord,
    updateProgress,
    retrievePatientInfo
} = require('./handlers')

const { jwtVerifierMidWare } = require('../mid-wares')
const bodyParser = require('body-parser')

const jsonBodyParser = bodyParser.json()

const router = new Router()

router.post('/users', jsonBodyParser, registerUser)

router.post('/users/auth', jsonBodyParser, authenticateUser)

router.get('/users', jwtVerifierMidWare, retrieveUser)

router.get('/users/medication', jwtVerifierMidWare, retrievePrescriptedMedication)

router.post('/users/add-prescription', [jwtVerifierMidWare, jsonBodyParser], addPrescription)

router.get('/users/prescription', jwtVerifierMidWare, retrievePrescription)

router.delete('/users/prescription/:drugId', jwtVerifierMidWare, deletePrescription)

router.post('/users/add-progress', [jwtVerifierMidWare, jsonBodyParser], addProgress)

router.get('/users/progress', jwtVerifierMidWare, retrieveProgress)

router.get('/drug/:id', retrieveDrug)

router.get('/drugs', retrieveDrugs)

router.get('/users/contacts', jwtVerifierMidWare, retrieveContacts)

router.post('/users/add-contact', [jwtVerifierMidWare, jsonBodyParser], addContact)

router.post('/users/add-progress-record', [jwtVerifierMidWare, jsonBodyParser], addProgressRecord)

router.get('/users/progress-record', jwtVerifierMidWare, retrieveProgressRecord)

router.patch('/users/update-progress', jwtVerifierMidWare, updateProgress)

router.get('/users/retrieve-patient-info/:patientId', jwtVerifierMidWare, retrievePatientInfo)

module.exports = router