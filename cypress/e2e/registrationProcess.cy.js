describe("Testing the Registration Process",()=>{
    it("Testing the Sign Up Process with Valid Data",()=>{
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

    it("Test the Sign In Process",()=>{
        cy.clearCookie("token")
        cy.visit("http://localhost:3000")
        cy.get('#credential').clear('i');
        cy.get('#credential').type('info@buna.et');
        cy.get('#password').clear('1');
        cy.get('#password').type('12345678');
        cy.get('.MuiButton-contained').click();
    })
})