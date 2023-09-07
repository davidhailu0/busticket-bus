import { signInTripManager } from "../support/grapql-queries";

describe("Schedule Test Process",()=>{
    it("Schedule for the first time process",()=>{
        cy.request({url:"http://localhost:9000/api/v1/deleteTestDataEmployee/DRIVER",method:"DELETE"})
        cy.request({url:"http://localhost:9000/api/v1/deleteTestDataBus",method:"DELETE"})
        cy.request({url:"http://localhost:9000/api/v1/deleteScheduleData",method:"DELETE"})
        cy.requestGraphql(signInTripManager).then(resp=>{
            cy.setCookie("token",resp['body']["data"]["loginBusCompany"]["token"])
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
                    _id
                    address
                }
            }`).then((respEmp)=>{
                console.log(respEmp["body"])
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
                        VIN:"49cnancjnjnaf7854",
                        driver:"${respEmp["body"]["data"]["addEmployee"]["_id"]}"
                    },activity:{
                        companyId:"${resp['body']["data"]["loginBusCompany"]["_id"]}",
                        name:"Test Name"
                    }){
                        plateNumber
                    }
                }`)
            })
            cy.visit("http://localhost:3000")
        })
        cy.visit('http://localhost:3000/home');
        cy.get(':nth-child(4) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').click();
        cy.get(':nth-child(1) > .css-ow9wpt > .css-16p1w4b > .MuiButtonBase-root').click();
        cy.get('#Bus').click()
        cy.get('#menu-Bus > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root').click()
        const dateTime = new Date(new Date().toDateString())
        dateTime.setDate(dateTime.getDate()+1)
        const id1 = "#a"+(dateTime.getTime().toString().substring(2,dateTime.getTime().toString().length-5))
        dateTime.setDate(dateTime.getDate()+1)
        cy.get(id1).click();
        cy.get('.css-1h0srym-MuiGrid-root > .MuiButtonBase-root').click();
    })
})