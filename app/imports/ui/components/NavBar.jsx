import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
// import { Roles } from 'meteor/alanning:roles';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill, House, Bell } from 'react-bootstrap-icons';
// import { ROLE } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);
  const menuStyle = { marginBottom: '10px' };
  const notifNum = { position: 'absolute', top: '5px', left: '3em', background: 'red', color: 'white', borderRadius: '1em', fontSize: '0.6em', padding: '0 0.5em 0 0.5em' };
  return (
    <Navbar bg="light" expand="lg" style={menuStyle}>
      <Container>
        {/* <Navbar.Brand id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} to="/"></Navbar.Brand> */}
        <Navbar.Toggle aria-controls={COMPONENT_IDS.NAVBAR_COLLAPSE} />
        <Navbar.Collapse id={COMPONENT_IDS.NAVBAR_COLLAPSE}>
          <Nav className="me-auto justify-content-start">
            <Nav.Link id={COMPONENT_IDS.NAVBAR_HOME} as={NavLink} to="/" key="home">
              <House size={25} style={{ marginRight: '1em' }} />
            </Nav.Link>
            {currentUser ? ([
              <Nav.Link id={COMPONENT_IDS.NAVBAR_DIRECTORY} as={NavLink} to="/directory" key="directory">Directory</Nav.Link>,
              <Nav.Link id={COMPONENT_IDS.NAVBAR_ADD_BILL} as={NavLink} to="/create-bill" key="create-bill">Create Bill</Nav.Link>,
            ]) : ''}
            {/* {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? ( */}
            {/*  [<Nav.Link id={COMPONENT_IDS.NAVBAR_LIST_STUFF_ADMIN} as={NavLink} to="/admin" key="admin">Admin</Nav.Link>, */}
            {/*    <NavDropdown id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN} title="Manage" key="manage-dropdown"> */}
            {/*      <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_DATABASE} key="manage-database" as={NavLink} to="/manage-database"><CloudDownload /> Database</NavDropdown.Item> */}
            {/*    </NavDropdown>] */}
            {/* ) : ''} */}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} title="Login">
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} as={NavLink} to="/signin"><PersonFill />Sign in</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} as={NavLink} to="/signup"><PersonPlusFill />Sign up</NavDropdown.Item>
              </NavDropdown>
            ) : ([
              <Nav.Link id={COMPONENT_IDS.NAVBAR_INBOX} style={{ position: 'relative', marginRight: '1.5em' }} as={NavLink} to="/inbox" key="inbox">
                <Bell size={25} />
                <p style={notifNum}>5</p>
              </Nav.Link>,
              <NavDropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} title={currentUser}>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_PROFILE} as={NavLink} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_SIGN_OUT} as={NavLink} to="/signout"><BoxArrowRight /> Sign out</NavDropdown.Item>
              </NavDropdown>,
            ])}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
