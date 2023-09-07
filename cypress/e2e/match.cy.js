import { signIn } from "../support/grapql-queries"

describe("Matching Process",()=>{
    it("Matching the Driver with Bus Process",()=>{
        cy.requestGraphql(signIn).then(resp=>{
            cy.setCookie("token",resp['body']["data"]["loginBusCompany"]["token"])
            cy.requestGraphql(`mutation addBus{
                addBus(newBusInput:{
                    busOwner:"${resp['body']["data"]["loginBusCompany"]["_id"]}",
                    busBrand:"busBrand",
                    busModel:"busModel",
                    manufacturedYear:2015,
                    plateNumber:"3aa45123",
                    features:["USB Charger","WI-FI"],
                    numberOfSeats:49,
                    unavailableSeats:[10],
                    VIN:"49cnancjnjnaf7854"
                },activity:{
                    companyId:"${resp['body']["data"]["loginBusCompany"]["_id"]}",
                    name:"Test Name"
                }){
                    plateNumber
                }
            }`)
            cy.requestGraphql(`
            mutation addEmployee{
                addEmployee(employeeInfo:{
                    name:"employeeName",
                    phoneNumber:["0920445566"],
                    busCompany:"${resp['body']["data"]["loginBusCompany"]["_id"]}",
                    address:"employeeAddress",
                    role:"DRIVER",
                    password:null,
                    emergencyContactName:"emergencyName",
                    emergencyContactPhone:"0955663322",
                    suretyName:"guarantorName",
                    suretyPhone:"0877445566",
                    languages:["Amharic","English"],
                    licenseType:"Level 5",
                    licenseID:"1452365",
                    licensePhoto:"driverPhoto",
                    licenseExpiryDate:"${Date.now().toString()}"
                    },
                    activity:{
                        companyId:"${resp['body']["data"]["loginBusCompany"]["_id"]}",
                        name:"Test Name"
                    }){
                    address
                }
            }`)
        })
        cy.visit("http://localhost:3000")
        cy.get(':nth-child(2) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').click();
        cy.get('.css-1sxob11 > .MuiBox-root').click();
        cy.get('body').click();
        cy.get('#menu-driver > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root').click();
        cy.get('.css-1y8lqyb > .MuiButtonBase-root').click();
    })
})


