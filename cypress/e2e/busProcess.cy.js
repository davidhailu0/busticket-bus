import { signIn } from "../support/grapql-queries"
describe("Bus Activities Process",()=>{
    it("Signing Up Process",()=>{
        cy.requestGraphql(signIn).then(resp=>{
            cy.setCookie("token",resp['body']["data"]["loginBusCompany"]["token"])
        })
        cy.request({url:"http://localhost:9000/api/v1/deleteTestData",method:"DELETE"})
        cy.visit("http://localhost:3000")
        cy.get('.MuiGrid-grid-sm-4 > .MuiBox-root > .MuiButtonBase-root').click();
        cy.get('#name').clear('B');
        cy.get('#name').type('Bunna Bus');
        cy.get('#phoneNumber').clear('0');
        cy.get('#phoneNumber').type('0922336655');
        cy.get('#email').clear('i');
        cy.get('#email').type('info@buna.et');
        cy.get('#password').clear('1');
        cy.get('#password').type('12345678');
        cy.get('#buses').clear('1');
        cy.get('#buses').type('10');
        cy.fixture('awash.png', { encoding: null }).as('myFixture')
        cy.get('#logoFile').selectFile("@myFixture");
        cy.fixture('image 8.svg', { encoding: null }).as('mySecondFixture')
        cy.get('#licenseFile').selectFile("@mySecondFixture")
        cy.get('.MuiButton-contained').click();
        cy.wait(5000)
    })

    it("Adding Bus Process",()=>{
        cy.request({url:"http://localhost:9000/api/v1/deleteTestDataBus",method:"DELETE"})
        cy.requestGraphql(signIn).then(resp=>{
            cy.setCookie("token",resp['body']["data"]["loginBusCompany"]["token"])
        })
        cy.get(':nth-child(3) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').click();
        cy.get('.css-b12azy > .MuiButtonBase-root').click();
        cy.get('#Plate\\ Number').clear('3');
        cy.get('#Plate\\ Number').type('3aa47589');
        cy.get('#Brand').clear('C');
        cy.get('#Brand').type('Camry');
        cy.get('#__next').click();
        cy.get('#Brand').clear();
        cy.get('#Brand').type('Volvo');
        cy.get('#Model').clear('C');
        cy.get('#Model').type('Camry');
        cy.get('#Manufactured\\ Year').clear('2');
        cy.get('#Manufactured\\ Year').type('2015');
        cy.get('#VIN').click();
        cy.get('#VIN').clear('4Y1SL65848Z411439');
        cy.get('#VIN').type('4Y1SL65848Z411439');
        cy.get('.MuiGrid-container > :nth-child(6)').click();
        cy.get('#Number\\ of\\ Seats').click();
        cy.get('#Number\\ of\\ Seats').click();
        cy.get('#MultiSelectOption').click()
        cy.get('[tabindex="0"] > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
        cy.get('[tabindex="-1"] > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
        cy.get('#menu-Features > .MuiBackdrop-root').click();
        cy.get('.css-1yoz2c2-MuiGrid-root > .MuiButtonBase-root').click();
        cy.wait(5000)
    })

    it("Editing Bus Process",()=>{
        cy.requestGraphql(signIn).then(resp=>{
            cy.setCookie("token",resp['body']["data"]["loginBusCompany"]["token"])
        })
        cy.visit("http://localhost:3000")
        cy.get(':nth-child(3) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').click();
        cy.get('#bus0').click();
        cy.get('.css-7cw8bo-MuiGrid-root > .MuiButtonBase-root').click();
        cy.get('body').click();
        cy.get('[tabindex="0"] > .MuiButtonBase-root > .PrivateSwitchBase-input').uncheck();
        cy.get('#menu- > .MuiBackdrop-root').click();
        cy.get('#Enter\\ Seat\\ Number').clear().type("48");
        cy.get('body').click()
        cy.get('.css-1aq9lje-MuiGrid-root > .MuiBox-root > .MuiButtonBase-root').click();
        cy.get(':nth-child(6) > :nth-child(1) > :nth-child(1) > .MuiTypography-root').click();
        cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
        cy.get('.css-7cw8bo-MuiGrid-root > .MuiButtonBase-root').click();
    })
})