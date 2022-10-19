import React from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Navbar, Nav, NavDropdown, ProgressBar } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, House, EnvelopePaper, QuestionCircle } from 'react-bootstrap-icons';
import { ROLE } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Emails } from '../../api/email/EmailCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import BillCalendar from './Calendar';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser, notificationCount, user, ready } = useTracker(() => {
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const subscription = Emails.subscribeEmail();
    const rdy = subscription.ready() && userSubscription.ready() && adminSubscription.ready();
    const emailData = Emails.find({ recipients: currUser, isDraft: false }, {}).fetch();
    const ccData = Emails.find({ ccs: currUser, isDraft: false }, {}).fetch();
    const bccData = Emails.find({ bccs: currUser, isDraft: false }, {}).fetch();
    ccData.forEach(data => {
      if (!_.contains(_.pluck(emailData, '_id'), data._id)) {
        emailData.push(data);
      }
    });
    bccData.forEach(data => {
      if (!_.contains(_.pluck(emailData, '_id'), data._id)) {
        emailData.push(data);
      }
    });
    const unread = [];
    emailData.forEach(data => {
      if (!_.contains(data.isRead, currUser)) {
        unread.push(data);
      }
    });

    let usr = UserProfiles.findOne({ email: currUser }, {});
    if (usr === undefined) usr = AdminProfiles.findOne({ email: currUser }, {});
    return {
      currentUser: currUser,
      user: usr,
      notificationCount: _.size(unread),
      ready: rdy,
    };
  }, []);

  const menuStyle = { marginBottom: '10px' };
  const notifNum = { position: 'absolute', top: '5px', left: '3em', background: 'red', color: 'white', borderRadius: '1em', fontSize: '0.6em', padding: '0 0.5em 0 0.5em' };

  return ready ? (
    <Navbar bg="light" expand="lg" style={menuStyle}>
      <Container>
        <Navbar.Toggle aria-controls={COMPONENT_IDS.NAVBAR_COLLAPSE} />
        <Navbar.Collapse id={COMPONENT_IDS.NAVBAR_COLLAPSE}>
          <Nav className="me-auto justify-content-start">
            <Nav.Link id={COMPONENT_IDS.NAVBAR_HOME} as={NavLink} to="/directory" key="home">
              <House size={25} style={{ marginRight: '1em' }} />
            </Nav.Link>
            {currentUser ? ([
              <Nav.Link id={COMPONENT_IDS.NAVBAR_DIRECTORY} as={NavLink} to="/directory" key="directory">Directory</Nav.Link>,
              <Nav.Link id={COMPONENT_IDS.NAVBAR_MY_FOLDERS} as={NavLink} to="/MyFolders" key="my-folders">My Folders</Nav.Link>,
            ]) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} title="Login" key="login">
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} as={NavLink} to="/signin" key="signin"><PersonFill />Sign in</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} as={NavLink} to="/forgot-password"><QuestionCircle />Forgot password?</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link id={COMPONENT_IDS.NAVBAR_INBOX} style={{ margin: 5, position: 'relative' }} as={NavLink} to="/inbox" key="inbox">
                  <EnvelopePaper size={25} />
                  {notificationCount !== 0 ? <p style={notifNum}>{notificationCount}</p> : ''}
                </Nav.Link>
                <Nav.Link to="#" style={{ position: 'relative' }}>
                  <BillCalendar show />
                </Nav.Link>
              </>
            )}
            {currentUser !== '' && Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
              <NavDropdown id={COMPONENT_IDS.NAVBAR_ADMIN} title="Admin" key="Admin" style={{ marginTop: 5 }}>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_MEMBERS} as={NavLink} to="/employees" key="employees">Employee List</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_REGISTER_USER} as={NavLink} to="/signup" key="signup">Register User</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_CHANGE_PASSWORD_ADMIN} as={NavLink} to="/change-password-admin" key="change-password-admin">Reset Employee Password</NavDropdown.Item>
              </NavDropdown>
            ) : ''}
            {currentUser !== '' ? (
              <NavDropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} title={currentUser} key="currUser" style={{ marginTop: 5 }}>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_PROFILE} as={NavLink} to={`/profile/${user._id}`} key="profile">Profile</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_CHANGE_PASSWORD_USER} as={NavLink} to="/change-password-user" key="change-password-user">Change Password</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_SIGN_OUT} as={NavLink} to="/signout" key="signout"><BoxArrowRight /> Sign out</NavDropdown.Item>
              </NavDropdown>
            ) : ''}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  ) : <ProgressBar animated now={100} />;
};

export default NavBar;
