import { signIn } from "../support/grapql-queries"
describe("Employee Process Testing",()=>{
    
    it("Adding Driver Process",()=>{
        cy.requestGraphql(signIn).then(resp=>{
            cy.setCookie("token",resp['body']["data"]["loginBusCompany"]["token"])
        })
        cy.request({url:"http://localhost:9000/api/v1/deleteTestDataEmployee/ALL",method:"DELETE"})
        cy.visit("http://localhost:3000")
        cy.get(':nth-child(5) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').click();
        cy.get('.css-1n932kb > .MuiButtonBase-root').click();
        cy.get('#Name').clear('A');
        cy.get('#Name').type('Abebe');
        cy.get('body').click();
        cy.get('#Role_id').click();
        cy.get('[data-value="DRIVER"]').click()
        cy.get('#Phone\\ Number\\ 1').click();
        cy.get('#Phone\\ Number\\ 1').clear('0');
        cy.get('#Phone\\ Number\\ 1').type('0955555555');
        cy.get('#License\\ ID').clear('1');
        cy.get('#License\\ ID').type('124125');
        cy.get('#\\:ri\\:').clear('1');
        cy.get('#\\:ri\\:').type('15-02-2025');
        cy.get(':nth-child(9) > .MuiBox-root > .MuiButtonBase-root').click();
        cy.fixture('driverLicense.png', { encoding: null }).as('myFixture')
        cy.get('#licenseImage').selectFile("@myFixture")
        cy.get('#Address').clear('K');
        cy.get('#Address').type('Kasanchis');
        cy.get('#Emergency\\ Responder\\ Name').clear('B');
        cy.get('#Emergency\\ Responder\\ Name').type('Belete');
        cy.get('#Emergency\\ Responder\\ Phone').clear('0');
        cy.get('#Emergency\\ Responder\\ Phone').type('0222222222');
        cy.get('#Guarantor\\ Name').clear('K');
        cy.get('#Guarantor\\ Name').type('Kebede');
        cy.get('#Guarantor\\ Phone').clear('0');
        cy.get('#Guarantor\\ Phone').type('0111111111');
        cy.get('#MultiSelectOption').click()
        cy.get('[data-value="English"] > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
        cy.get('[aria-selected="false"] > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
        cy.get('#menu- > .MuiBackdrop-root').click();
        cy.get('#Add\\ Other\\ Languages').clear('O');
        cy.get('#Add\\ Other\\ Languages').type('Afaan Oromo');
        cy.get('.css-1rxlpj-MuiGrid-root > .MuiButtonBase-root').click();
        cy.wait(5000)
    })

    it("Editing Employee Process",()=>{
        cy.requestGraphql(signIn).then(resp=>{
            cy.setCookie("token",resp['body']["data"]["loginBusCompany"]["token"])
        })
        cy.visit("http://localhost:3000")
        cy.get(':nth-child(5) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').click();
        cy.get('[data-testid="MoreVertIcon"]').click();
        cy.get('.css-1t3k1b1-MuiModal-root-MuiPopover-root-MuiMenu-root > .MuiPaper-root > .MuiList-root > [tabindex="-1"] > .MuiTypography-root').click();
        cy.get('.css-1rxlpj-MuiGrid-root > .MuiButtonBase-root').click();
        cy.get('.PrivateSwitchBase-input').uncheck();
        cy.get('#__next').click();
        cy.get('#Address').clear();
        cy.get('#Address').type('Bole');
        cy.get('.css-1rxlpj-MuiGrid-root > .MuiButtonBase-root').click();
    })

    it("Adding Trip Manager Process",()=>{
        cy.requestGraphql(signIn).then(resp=>{
            cy.setCookie("token",resp['body']["data"]["loginBusCompany"]["token"])
        })
        cy.visit("http://localhost:3000")
        cy.get(':nth-child(5) > .MuiButtonBase-root > .MuiListItemText-root > .MuiTypography-root').click();
        cy.get('.css-1n932kb > .MuiButtonBase-root').click();
        cy.get('#Name').clear('A');
        cy.get('#Name').type('Abebe');
        cy.get('body').click();
        cy.get('#Role_id').click();
        cy.get('[data-value="TRIP MANAGER"]').click()
        cy.get('#Password').clear('1');
        cy.get('#Password').type('12345678');
        cy.get('#Phone\\ Number\\ 1').click();
        cy.get('#Phone\\ Number\\ 1').clear('0');
        cy.get('#Phone\\ Number\\ 1').type('0911111111');
        cy.get('#Phone\\ Number\\ 2').clear('0');
        cy.get('#Phone\\ Number\\ 2').type('0922222222');
        cy.get('#Address').clear('Kasanchis');
        cy.get('#Address').type('Kasanchis');
        cy.get('#Guarantor\\ Name').clear('Kebede');
        cy.get('#Guarantor\\ Name').type('Kebede');
        cy.get('#Guarantor\\ Phone').clear('0111111111');
        cy.get('#Guarantor\\ Phone').type('0111111119');
        cy.get('#MultiSelectOption').click()
        cy.get('[tabindex="0"] > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
        cy.get('#menu- > .MuiBackdrop-root').click();
        cy.get('#MultiSelectOption').click()
        cy.get('[data-value="Other"] > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
        cy.get('#menu- > .MuiBackdrop-root').click();
        cy.get('#Add\\ Other\\ Languages').click();
        cy.get('#Add\\ Other\\ Languages').clear('S');
        cy.get('#Add\\ Other\\ Languages').type('Sidama');
        cy.get('.css-1rxlpj-MuiGrid-root > .MuiButtonBase-root').click();
    })
})