import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Col, Container, Row, ProgressBar, Nav } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Link, Navigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';

const billProgress = 60;

/* Renders a table containing all of the Measure documents. */
const Directory = () => {
  const { ready, currentUser } = useTracker(() => {
    const username = Meteor.user() ? Meteor.user().username : '';
    let rdy;
    let usr;

    if (Roles.userIsInRole(Meteor.userId(), [ROLE.USER])) {
      const subscription = UserProfiles.subscribe();
      rdy = subscription.ready();
      usr = UserProfiles.findByEmail(username);
    } else {
      const subscription = AdminProfiles.subscribe();
      rdy = subscription.ready();
      usr = AdminProfiles.findByEmail(username);
    }
    return {
      currentUser: usr,
      ready: rdy,
    };
  }, []);
  if (ready && currentUser.newAccount) {
    return (<Navigate to="/change-password-user" />);
  }
  return (ready ? (
    <Container id={PAGE_IDS.DIRECTORY} className="py-3">
      <Row className="justify-content-center">
        <Col className="folder-section">
          <h6 align="center" style={{ marginBottom: 20 }}>Legislative Tracking System 2022</h6>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">BOE</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Deputy</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third">OCID</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="fourth">OFO</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="fifth">OFS</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sixth">OHE</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="seventh">OITS</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="eighth">OSIP</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="ninth">OSSS</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tenth">OTM</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="eleventh">Supt</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col xs={10}>
          <Tabs defaultActiveKey="all-bills" id="fill-tab-example" className="mb-3" fill>
            <Tab eventKey="all-bills" title="All Bills">
              <Row>
                <Table>
                  <thead>
                    <tr>
                      <th scope="col">Bill #</th>
                      <th scope="col">Bill</th>
                      <th scope="col">Office</th>
                      <th scope="col">Action</th>
                      <th scope="col">Rationale</th>
                      <th scope="col">Committee</th>
                      <th scope="col">Hearing</th>
                      <th scope="col">Type</th>
                      <th scope="col">Position</th>
                      <th scope="col">Testifier</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <Link className="table-row" to="/view-bill">
                      <th scope="row">1234</th>
                      <td>.....</td>
                      <td>OCID BOE</td>
                      <td>Testimony</td>
                      <td>........</td>
                      <td>EDU, FIN</td>
                      <td>12/02/2022</td>
                      <td>Hearing</td>
                      <td>Support</td>
                      <td>John Doe</td>
                      <td>
                        <ProgressBar now={billProgress} label={`${billProgress}`} visuallyHidden />
                      </td>
                    </Link>
                  </tbody>
                </Table>
              </Row>
            </Tab>
            <Tab eventKey="inactive-bills" title="Inactive Bills">
              ...
            </Tab>
            <Tab eventKey="actions" title="Actions">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Monitor</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Testimony</Nav.Link>
                </Nav.Item>
              </Nav>
            </Tab>
            <Tab eventKey="hearings" title="Hearings">
              ...
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  ) : '');
};

export default Directory;
