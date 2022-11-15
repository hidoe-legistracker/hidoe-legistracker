import React from 'react';
import { Col, Container, Row, Tab, Nav, Tabs, Table, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Link, NavLink } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import LoadingSpinner from '../components/LoadingSpinner';

const testimonyWriter = () => {

  const { user, ready } = useTracker(() => {
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = userSubscription.ready() && adminSubscription.ready();

    let usr = UserProfiles.findOne({ email: currUser });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: currUser });
    }

    return {
      user: usr,
      ready: rdy,
    };
  });

  // eslint-disable-next-line no-nested-ternary
  return (ready ? (user.position === 'Testimony Writer' ? (user.assignedTestimony !== undefined ? (
    <Container id={PAGE_IDS.TESTIMONY_WRITER} className="py-3">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={4}>
            <Nav variant="pills" className="flex-column">
              {user.assignedTestimony.map((testimony, index) => (
                <Nav.Item><Nav.Link eventKey={index}>Assigned by {testimony.office} Secretary {testimony.assignerFirst} {testimony.assignerLast} ({testimony.assigner})</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col>
            <Tab.Content>
              { user.assignedTestimony.map((testimony, index) => (
                <Tab.Pane eventKey={index}>
                  <Col>
                    <Tabs defaultActiveKey="all-bills" id="fill-tab-example" className="mb-3" fill>
                      <Tab eventKey="all-bills" title={testimony.office}>
                        <Row>
                          <Table>
                            <thead style={{ marginBottom: 10 }}>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Bill Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">Main Office</th>
                                <th scope="col">Type</th>
                                <th scope="col">Monitoring Report</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <Link className="d-lg-table-cell link-dark" as={NavLink} exact to={`/view-bill/${testimony.measureID}`}>{testimony.measureNumber}</Link>
                                <Link className="d-table-cell link-dark" as={NavLink} exact to={`/view-bill/${testimony.measureID}`}>{testimony.measureTitle}</Link>
                                <Link className="d-table-cell link-dark" as={NavLink} exact to={`/view-bill/${testimony.measureID}`}>{testimony.measureDescription}</Link>
                                <Link className="d-table-cell link-dark" as={NavLink} exact to={`/view-bill/${testimony.measureID}`}>{testimony.office}</Link>
                                <Link className="d-table-cell link-dark" as={NavLink} exact to={`/view-bill/${testimony.measureID}`}>{testimony.measureType}</Link>
                                <td>
                                  <Button className="secondary link" as={NavLink} exact to={`/monitoring-report/${testimony.measureID}`}>Monitoring Report</Button>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Row>
                      </Tab>
                    </Tabs>
                  </Col>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>

  ) : <h1>No testimonies assigned</h1>) : <h1>Must be a Testimony Writer</h1>) : <LoadingSpinner message="Loading Measures" />);
};
export default testimonyWriter;
