require('dotenv').config()
const { TEST_MONGODB_URL, MONGODB_URL } = process.env

const { mongoose, models: { Drug } } = require('pill-o-clock-data')

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => 
    Promise.all([Drug.create({drugName: "Adiro", description: "Adiro is commonly used for blood or cardiovascular diseases.", link: "https://cima.aemps.es/cima/dochtml/p/62825/Prospecto_62825.html"}), Drug.create({drugName: "Eutirox", description: "Eutirox is used for thyroid issues", link: "https://cima.aemps.es/cima/dochtml/p/64014/P_64014.html"}),  Drug.create({drugName: "Paracetamol", description: "Paracetamol is used for mild pain and fever", link: "https://cima.aemps.es/cima/dochtml/p/70310/Prospecto_70310.html"}), Drug.create({drugName: "Furosemide", description: "Furosemide is a strong diuretic (to pee more), is used for high blood pressure.", link: "https://cima.aemps.es/cima/dochtml/p/79029/Prospecto"}), Drug.create({drugName: "Lorazepam", description: "Lorazepam is used for anxiety and sleep problems.", link: "https://cima.aemps.es/cima/dochtml/p/64251/P_64251.html"}), Drug.create({drugName: "Simvastatin", description: "Simvastatin is used to lower down cholesterol", link: "https://cima.aemps.es/cima/dochtml/p/64251/P_64251.html"})])
).then(() => console.log('drugs inserted')).then(() => mongoose.disconnect()).then(() => {})