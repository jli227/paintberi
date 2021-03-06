describe('paintberi sign-up app', function() {
    var emailInp = element(by.model('user.email'));    
    var firstNameInp = element(by.model('user.fname'));
    var lastNameInp = element(by.model('user.lname'));
    var dobInp = element(by.model('user.dob'));
    var passwordInp = element(by.model('user.password'));
    var cPasswordInp = element(by.model('user.cPassword'));
    var signupBtn = element(by.buttonText('Sign Me Up!'));
    var resetBtn = element(by.buttonText('Reset'));

    var strengthElem = element(by.id('passwordStrength')),
        strengthBar = element(by.id('passwordStrengthBar'));

    function addEmail(text) {
        emailInp.sendKeys(text);
    }

    function fieldsAreBlank() {
        expect(emailInp.getAttribute('value')).toEqual('');
        expect(firstNameInp.getAttribute('value')).toEqual('');
        expect(lastNameInp.getAttribute('value')).toEqual('');
        expect(dobInp.getAttribute('value')).toEqual('');
        expect(passwordInp.getAttribute('value')).toEqual('');
        expect(cPasswordInp.getAttribute('value')).toEqual('');
    }

    function sendAllKeys() {
        emailInp.sendKeys('a@a.com');
        firstNameInp.sendKeys('firstname');
        lastNameInp.sendKeys('lastname');
        dobInp.sendKeys('11/15/94');
        passwordInp.sendKeys('password');
        cPasswordInp.sendKeys('password');
    }

    function fieldsAreDirty() {
        expect(emailInp.getAttribute('class')).toContain('ng-dirty');
        expect(lastNameInp.getAttribute('class')).toContain('ng-dirty');
        expect(dobInp.getAttribute('class')).toContain('ng-dirty');
        expect(passwordInp.getAttribute('class')).toContain('ng-dirty');
        expect(cPasswordInp.getAttribute('class')).toContain('ng-dirty');
    }

    function testPasswordBar(password, strength) {
        passwordInp.sendKeys(password);
        expect(strengthElem.getAttribute('class')).not.toContain('ng-hide');
        expect(strengthBar.getAttribute('aria-valuenow')).toEqual(strength);
        passwordInp.clear();
    }

    beforeEach(function() {
        //ena's path
        browser.get('http://localhost:8000/#/form');

        //vince's path
        //browser.get('http://localhost:8000');
    });

    // test for email
    it('must have display warning if email is not valid', function() {
        var emailAlertValid = element(by.id('emailValidAlert'));
        var emailAlertReqd = element(by.id('emailReqAlert'));

        expect(emailAlertReqd.isPresent()).toEqual(false);

        addEmail('test');
        expect(emailAlertValid.isPresent()).toEqual(true);

        emailInp.clear();
        expect(emailAlertReqd.isPresent()).toEqual(true);

        addEmail('test@test.com');
        expect(emailAlertValid.isPresent()).toEqual(false);
        expect(emailAlertReqd.isPresent()).toEqual(false);
    });

    //test for required birth date
    it('must have display warning if birth date is not present', function () {
    	var dobReq = element(by.id('dobReqAlert'));

    	//page rendered, no alert
    	expect(dobReq.isPresent()).toEqual(false);

    	//valid date, no alert
    	dobInp.sendKeys('11/15/1994');
    	expect(dobReq.isPresent()).toEqual(false);

		//type a too-young date -> no error
    	dobInp.sendKeys('11/15/05');
    	expect(dobReq.isPresent()).toEqual(false);
    });

    //test for 13 years or older
    it('must have display warning if user is not 13 or older', function () {
    	var dobYoung = element(by.id('dobYoungAlert'));
    	
    	//page rendered, no alert
    	expect(dobYoung.isPresent()).toEqual(false);

    	//valid date, no alert
    	dobInp.sendKeys('11/15/1994');
    	expect(dobYoung.isPresent()).toEqual(false);

		//type an invalid date -> no error
    	dobInp.sendKeys('11/15/05');
    	expect(dobYoung.isPresent()).toEqual(true);

    	//clear input, no alert <- considered empty not invalid
    	dobInp.clear();
    	expect(dobYoung.isPresent()).toEqual(false);

    	//spaces input, no alert <- considered empty not invalid
    	dobInp.sendKeys('    ');
    	expect(dobYoung.isPresent()).toEqual(false);       	
    });

    //test for valid date
    it('must have display warning if user did not give a valid date', function () {
    	var dobValid = element(by.id('dobValidAlert'));

    	//page render
    	expect(dobValid.isPresent()).toEqual(false);
    	
    	dobInp.sendKeys('november 15, 2005');
    	expect(dobValid.isPresent()).toEqual(true);
    	dobInp.clear();
    	
    	dobInp.sendKeys('nov 15, 2005');
    	expect(dobValid.isPresent()).toEqual(true);
    	dobInp.clear();

    	dobInp.sendKeys('november 15, 2001');
    	expect(dobValid.isPresent()).toEqual(true);
    	dobInp.clear();

    	dobInp.sendKeys('nov 15, 2005');
    	expect(dobValid.isPresent()).toEqual(true);
    	dobInp.clear();

    	dobInp.sendKeys('11/15/01');
    	expect(dobValid.isPresent()).toEqual(false);    	

    	//clear input, no alert <- considered empty not invalid    	
    	dobInp.clear();
    	expect(dobValid.isPresent()).toEqual(false);

    	//spaces input, no alert <- considered empty not invalid
    	dobInp.sendKeys('    ');
    	expect(dobValid.isPresent()).toEqual(false);      	
    });

    //test for required last name
    it('must display warning if last name is not present', function () {
    	var lastNameReq = element(by.id('lastNameAlert'));

    	expect(lastNameReq.isPresent()).toEqual(false);

    	lastNameInp.sendKeys('Lastname');
		expect(lastNameReq.isPresent()).toEqual(false);

		lastNameInp.sendKeys('Lastname');
		lastNameInp.clear();
		expect(lastNameReq.isPresent()).toEqual(true);

		lastNameInp.sendKeys('    ');
		expect(lastNameReq.isPresent()).toEqual(true);
    });

    it('must display error if password or confirm password entry is empty', function() {
        var passwordReq = element(by.id('passwordReqError'));
        var cPasswordReq = element(by.id('cPasswordReqError'));
        var passwordMatch = element(by.id('passwordMatchError'));

        passwordInp.sendKeys('test');
        expect(passwordReq.isPresent()).toEqual(false);

        passwordInp.clear();
        expect(passwordInp.isPresent()).toEqual(true);

        cPasswordInp.sendKeys('test');
        expect(cPasswordReq.isPresent()).toEqual(false);

        cPasswordInp.sendKeys('test');
        cPasswordInp.clear();
        expect(cPasswordReq.isPresent()).toEqual(true);

        passwordInp.sendKeys('test');
        cPasswordInp.sendKeys('test');
        expect(passwordMatch.isPresent()).toEqual(false);

        passwordInp.sendKeys('test');
        cPasswordInp.sendKeys('testfail');
        expect(passwordMatch.isPresent()).toEqual(true);
    });

    // test for the success message
    it('must only allow user to sign up if all forms are filled out and then display success message', function() {
        var success = element(by.id('successAlert'));

        expect(signupBtn.getAttribute('disabled')).toEqual('true');
        expect(success.getAttribute('class')).toContain('ng-hide');

        addEmail('a@a.com');
        lastNameInp.sendKeys('Lastname');
        dobInp.sendKeys('11/15/1994');
        passwordInp.sendKeys('pass');
        cPasswordInp.sendKeys('pass');

        expect(signupBtn.getAttribute('disabled')).toBe(null);
        signupBtn.click();
        expect(success.getAttribute('class')).not.toContain('ng-hide');
    });

    //test for reset button
    it('must clear fields on reset', function () {
        //page render
        expect(signupBtn.getAttribute('disabled')).toEqual('true');
        resetBtn.click();
        fieldsAreBlank();        

        sendAllKeys();
        expect(signupBtn.getAttribute('disabled')).toBe(null);
        resetBtn.click();
        fieldsAreBlank();
        expect(signupBtn.getAttribute('disabled')).toEqual('true');
        fieldsAreDirty();

        browser.refresh();

        emailInp.sendKeys('a@a.com');
        lastNameInp.sendKeys('lastname');
        expect(signupBtn.getAttribute('disabled')).toEqual('true');
        resetBtn.click();
        fieldsAreBlank();
        expect(emailInp.getAttribute('class')).toContain('ng-dirty');
        expect(lastNameInp.getAttribute('class')).toContain('ng-dirty');
        expect(signupBtn.getAttribute('disabled')).toEqual('true');
    });
  
    it('must display password strength based on password input', function () {
        //on render
        expect(strengthElem.getAttribute('class')).toContain('ng-hide');

        testPasswordBar('hello', '20');

        //testing clear()        
        expect(strengthElem.getAttribute('class')).not.toContain('ng-hide');
        expect(strengthBar.getAttribute('aria-valuenow')).toEqual('0');
    
        testPasswordBar('helloeightchars', '40');
        testPasswordBar('hello5', '40');
        testPasswordBar('Hello5', '60');
        testPasswordBar('Hello5!', '80');
        testPasswordBar('Helloeightchars5!', '100');
        //4 spaces
        testPasswordBar('    ', '20');
        //9 spaces
        testPasswordBar('         ', '40');
    });
});