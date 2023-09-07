import { signInTripManager } from "../support/grapql-queries";

describe("Trip Process Validation Test Case",()=>{
    it("Checking the trip process",()=>{
        cy.requestGraphql(signInTripManager).then(resp=>{
            cy.setCookie("token",resp['body']["data"]["loginBusCompany"]["token"])
        })
        cy.visit("http://localhost:3000")
        cy.get(':nth-child(2) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').click();
        cy.get('.MuiGrid-grid-xs-12 > .MuiButtonBase-root').click();
    })
})