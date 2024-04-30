import puppeteer from 'puppeteer';

async function loginUser(page) {
  await page.goto('http://localhost:3000/login');
  await page.type('#username', 'christest'); 
  await page.type('#password', 'chrischris'); 
  await page.click('#loginButton'); 
  await page.waitForNavigation(); 
}

async function testHomePage() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login');
    await loginUser(page);
    await page.goto('http://localhost:3000/');
    const title = await page.title();
    console.log('Home Page title:', title);
    console.log('Expected: ');
    await browser.close();
}

async function testRegistration() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/register');

    await page.type('#username', 'newuser');
    await page.type('#password', 'newpassword');
    await page.click('#registerButton'); 

    await page.waitForNavigation();
    console.log('New page URL:', page.url());
    console.log('Expected: http://localhost:3000/');
    await browser.close();
}

async function testLogin() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login');

    await page.type('#username', 'christest'); 
    await page.type('#password', 'chrischris');
    await page.click('#loginButton');

    await page.waitForNavigation();
    console.log('Logged in, new page URL:', page.url());
    console.log('Expected: http://localhost:3000/' );
    await browser.close();
}

async function testSessionDetails() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login');
    await loginUser(page);
    await page.goto('http://localhost:3000/session/662cc3c895c80e43c5896ad7'); 
    const content = await page.content(); 
    if (content.includes("Comments")) {
        console.log("Comments section is displayed correctly.");
    } else {
        console.error("Comments section is not displayed correctly.");
    }



    await browser.close();
}

async function runTests() {
    await testHomePage();
    await testRegistration();
    await testLogin();
    await testSessionDetails();
}

runTests();
