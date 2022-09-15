import { t } from 'testcafe';
import { directoryPage, myFoldersPage, inboxPage, signOutPage, createEmailPage } from './simple.page';
import { signInPage } from './signin.page';
import { createMeasurePage } from './createmeasure.page';
import { navBar } from './navbar.component';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme' };
// const newCredentials = { username: 'jane@foo.com', password: 'changeme' };

fixture('hidoe-legistracker localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing / sign in page shows up', async () => {
  await signInPage.isDisplayed();
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
  await t.click(`#${COMPONENT_IDS.INBOX_CREATE_EMAIL_BUTTON}`);
  await createEmailPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test Create Measure Page', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  await navBar.gotoCreateMeasurePage();
  await createMeasurePage.isDisplayed();

  // Fill out measure form
  await createMeasurePage.createMeasure();

  await navBar.logout();
  await signOutPage.isDisplayed();
});
