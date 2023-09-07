export const signIn = `
mutation loginBusCompany{
    loginBusCompany(loginInfo:{email:"info@buna.et",password:"12345678"}){
        _id
        token
    }
  }
`
export const signInTripManager = `
mutation loginBusCompany{
    loginBusCompany(loginInfo:{email:"0911111111",password:"12345678"}){
        _id
        token
    }
  }
`

export const addBus = `
mutation addBus{
    addBus(newBusInput:{
        busOwner:token._id,
        busBrand:busBrand,
        busModel:busModel,
        manufacturedYear:parseInt(manufacturedDate),
        plateNumber:plateNumber,
        features:selectedFeatures,
        numberOfSeats:parseInt(seatNumber),
        unavailableSeats:numberOfUnavailbleSeats,
        VIN:VIN
    },activity:{
        companyId:token._id,
        name:token.accountName
    }){
        plateNumber
    }
}`