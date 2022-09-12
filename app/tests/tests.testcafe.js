// import { Selector, t } from 'testcafe';
import { directoryPage, myFoldersPage, createMeasurePage, inboxPage, signOutPage } from './simple.page';
import { signInPage } from './signin.page';
import { navBar } from './navbar.component';
// import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme' };
// const newCredentials = { username: 'jane@foo.com', password: 'changeme' };

fixture('meteor-application-template-production localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async () => {
  await signInPage.isDisplayed();
});

test('Test that signin and signout work', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that user pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoDirectoryPage();
  await directoryPage.isDisplayed();
  await navBar.gotoMyFoldersPage();
  await myFoldersPage.isDisplayed();
  await navBar.gotoInboxPage();
  await inboxPage.isDisplayed();
  // want to see if we can get to the editStuffPage
  // const editLinks = await Selector(`.${COMPONENT_IDS.LIST_STUFF_EDIT}`);
  // await t.click(editLinks.nth(0));
  // await editStuffPage.isDisplayed();
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that admin pages show up', async () => {
  await navBar.gotoSignInPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  await navBar.gotoDirectoryPage();
  await directoryPage.isDisplayed();
  await navBar.gotoMyFoldersPage();
  await myFoldersPage.isDisplayed();
  await navBar.gotoCreateMeasurePage();
  await createMeasurePage.isDisplayed();
  await navBar.gotoInboxPage();
  await inboxPage.isDisplayed();
  // want to see if we can get to the editStuffPage
  // const editLinks = await Selector(`.${COMPONENT_IDS.LIST_STUFF_EDIT}`);
  // await t.click(editLinks.nth(0));
  // await editStuffPage.isDisplayed();
  // await navBar.gotoListStuffAdminPage();
  // await listStuffAdminPage.isDisplayed();
  // await navBar.gotoManageDatabasePage();
  // await manageDatabasePage.isDisplayed();
});
