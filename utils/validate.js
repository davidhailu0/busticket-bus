export const validateEmail = (email)=>{
    let patt = new RegExp(/^[a-zA-Z]+\.?\d*\.?\w*\.?@\w+\.\w+(\.\w+)?$/g)
    return patt.test(email.trim())
}

export const validatePhone = (phoneNumber)=>{
    let patt = new RegExp(/^\+?251\d{9}$|^0\d{9}$/g)
    return patt.test(phoneNumber.trim())
}
export const validateName = (name)=>{
    let patt = new RegExp(/^[a-z\sA-Z]+$|^[\u1200-\u135A]+$/g)
    if(!patt.test(name.trim())||name.trim().length<3){
        return false
    }
        return true
}

export const validatePassword = (password)=>{
    if(password.length<8){
        return false
    }
    return true
}

export const validateNumber = (number)=>{
    let patt = new RegExp(/^\d+$/g)
    if(!patt.test(number)||parseInt(number)<1||number===""||parseInt(number)===NaN){
        return false
    }
    return true
}

export const validatePlateNumber = (plateNumber)=>{
    let patt = new RegExp(/^\d[a-zA-Z][a-zA-Z][a-zA-Z]?\d{5}$/g)
    if(!patt.test(plateNumber.trim())){
        return false
    }
    return true
}

export const validateYear = (year)=>{
    if(year.length===4&&parseInt(year)>1850&&parseInt(year)<=new Date().getFullYear()){
        return true
    }
    return false
}

export const validateVIN = (vin)=>{
    let vinNumber = vin.toLowerCase()
    let patt = new RegExp(/^[^\Wioq]{17}$/)
    if(!patt.test(vinNumber)){
        return false; 
    }

    const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

    let transliterations = {
        "a" :1, "b" : 2, "c": 3, "d": 4,
        "e":5, "f":6, "g":7, "h":8,
        "j":1, "k":2, "l":3, "m":4,
        "n":5, "p":7, "r":9, "s":2,
        "t":3, "u":4, "v":5, "w":6,
        "x":7, "y":8, "z":9
    };

    let sum = 0;

    for(let i = 0 ; i < vinNumber.length ; i++ ) { 
        if(isNaN(vinNumber[i])) {
            sum += transliterations[vinNumber[i]] * weights[i];
        } else {
            sum += parseInt(vinNumber[i]) * weights[i];
        }
    }

    let checkdigit = sum % 11;

    if(checkdigit === 10) { // checkdigit of 10 is represented by "X"
        checkdigit = "x";
    }

    return (checkdigit !== vinNumber[8]);
}