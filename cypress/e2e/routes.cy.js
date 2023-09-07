import { signIn } from "../support/grapql-queries"
describe("Route Process",()=>{
    it("Add Route to Bus Company",()=>{
        cy.requestGraphql(signIn).then(resp=>{
            cy.setCookie("token",resp['body']["data"]["loginBusCompany"]["token"])
            cy.request({url:"http://localhost:9000/api/v1/deleteBusCompanyRouteData/"+resp['body']["data"]["loginBusCompany"]["_id"],method:"DELETE"})
        })
        cy.visit('http://localhost:3000')
        cy.get(':nth-child(4) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').click();
        cy.get('.css-1x696ql > .MuiButtonBase-root').click();
        cy.get('#SelectRoutes_id').click()
        cy.get('[data-value="Jigjiga"]').click();
        cy.get(':nth-child(1) > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
        cy.get(':nth-child(2) > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
        cy.get('.css-16q3zmq-MuiGrid-root > .MuiButtonBase-root').click();
        cy.get('.MuiDialogContent-root > .MuiBox-root > .MuiButton-outlined').click();
    })
})
