module.exports = {
    registerUser: require('./register-user'),
    authenticateUser: require('./authenticate-user'),
    retrieveUser: require('./retrieve-user'),
    retrievePrescriptedMedication: require('./retrieve-prescripted-medication'),
    addPrescription: require('./add-prescription'),
    retrievePrescription: require('./retrieve-prescription'),
    deletePrescription: require('./delete-prescription'),
    addProgress: require('./add-progress'),
    retrieveProgress: require('./retrieve-progress'),
    addContact: require('./add-contact'),
    retrieveDrug: require('./retrieve-drug'),
    retrieveContacts: require('./retrieve-contacts'),
    retrieveDrugs: require('./retrieve-drugs'),
    addProgressRecord: require('./add-progress-record'),
    retrieveProgressRecord: require('./retrieve-progress-record'),
    updateProgress: require('./update-progress'),
    retrievePatientInfo: require(('./retrieve-patient-info'))
}