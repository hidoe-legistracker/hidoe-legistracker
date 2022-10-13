import {
  changePasswordPage,
  employeeListPage,
  myFoldersPage,
  resetEmployeePasswordPage,
  signOutPage,
} from './simple.page';
import { signInPage } from './signin.page';
import { signUpPage } from './signup.page';
import { directoryPage } from './directory.page';
import { inboxPage } from './inbox.page';
import { navBar } from './navbar.component';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme', firstName: 'John', lastName: 'Doe' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme', firstName: 'Admin', lastName: 'MATRP' };
const newCredentials = { username: 'jane@foo.com', password: 'changeme', firstName: 'Jane', lastName: 'Foo', employeeID: '1234567890' };

fixture('hidoe-legistracker localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing / sign in page shows up', async () => {
  await signInPage.isLandingDisplayed();
});

test('Test that signin and signout work', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test Directory Page', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoDirectoryPage();
  await directoryPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test My Folders Page', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoMyFoldersPage();
  await myFoldersPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test Inbox and Create Email Pages', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoInboxPage();
  await inboxPage.isDisplayed();
  await inboxPage.createEmail();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test EmployeeList Page', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  await navBar.gotoEmployeeListPage();
  await employeeListPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test Register User Page', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  await navBar.gotoRegisterUserPage();
  await signUpPage.isDisplayed();
  await signUpPage.signupUser(newCredentials);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test Reset Employee Password Page', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  await navBar.gotoResetEmployeePasswordPage();
  await resetEmployeePasswordPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test Change Password Page', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoChangePasswordPage();
  await changePasswordPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});
