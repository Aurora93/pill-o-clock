    
module.exports = function (info, drug){
    delete info.drug;
    let keys = Object.keys(info);

    for (const key in info) {
    if (typeof info[key] === 'undefined' || key.includes('hour') &&  !isNaN(info[key]) && info[key] > 24)
        throw new Error('Please, introduce a correct hour')
    if (typeof info[key] === 'undefined' || key.includes('min') && !isNaN(info[key]) && info[key] > 59)
        throw new Error('Please, introduce a correct minutes')
    }

    const times = []

    for (let i = 1; i < keys.length / 2 + 1; i++) {
    if (info[`hour${i}`].length === 1) {info[`hour${i}`] = `0${info[`hour${i}`]}`}

    times.push(`${info[`hour${i}`]}` + `${info[`min${i}`]}`)
    }
    return times 
}    