const context = require('./context')

module.exports = {
    get __context__() { return context },
    registerUser: require('./register-user'),
    login: require ('./login'),
    retrieveUser: require('./retrieve-user'),
    retrieveMedication: require('./retrieve-medication'),
    addMedication: require('./add-medication'),
    retrieveDrug: require('./retrieve-drug'),
    deleteMedication: require('./delete-medication'),
    retrieveContacts: require('./retrieve-contacts'),
    addContact: require('./add-contact'),
    retrieveDrugs: require('./retrieve-drugs'),
    addProgress: require('./add-progress'),
    retrieveProgress: require('./retrieve-progress'),
    addProgressRecord: require('./add-progress-record'),
    retrieveProgressRecord: require('./retrieve-progress-record'),
    updateProgress: require('./update-progress'),
    isLoggedIn: require('./is-logged-in'),
    retrievePatientInfo: require('./retrieve-patient-info'),
    deleteContact: require('./delete-contact')
}