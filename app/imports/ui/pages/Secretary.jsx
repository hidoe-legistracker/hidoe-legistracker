import React from 'react';
import { Col, Container, Row, Tab, Nav, Tabs, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import _ from 'underscore/underscore-node';
import { PAGE_IDS } from '../utilities/PageIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import SecretaryMeasureComponent from '../components/SecretaryMeasureComponent';

const Secretary = () => {

  const { user, ready, measures } = useTracker(() => {
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const measureSubscription = Measures.subscribeMeasures();
    const rdy = userSubscription.ready() && adminSubscription.ready() && measureSubscription.ready();

    const measureData = Measures.find({}, {}).fetch();
    let usr = UserProfiles.findOne({ email: currUser });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: currUser });
    }

    return {
      user: usr,
      ready: rdy,
      measures: measureData,
    };
  });

  // eslint-disable-next-line no-nested-ternary
  return (ready ? (user.position === 'Office Secretary' ? (
    <Container id={PAGE_IDS.SECRETARY} className="py-3">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={4}>
            <Nav variant="pills" className="flex-column">
              {user.offices.map((office, index) => (
                <Nav.Item><Nav.Link eventKey={index}>{office}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col>
            <Tab.Content>
              { user.offices.map((office, index) => (
                <Tab.Pane eventKey={index}>
                  <Col>
                    <Tabs defaultActiveKey="all-bills" id="fill-tab-example" className="mb-3" fill>
                      <Tab eventKey="all-bills" title={office}>
                        <Row>
                          <Table>
                            <thead style={{ marginBottom: 10 }}>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Bill Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">Main Office</th>
                                <th scope="col">Type</th>
                                <th scope="col">Assign Writer</th>
                              </tr>
                            </thead>
                            <tbody>
                              { _.where(measures, { mainOfficeType: office }).map((meas) => <SecretaryMeasureComponent measure={meas} userOffice={office} />) }
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

  ) : 'Must be a Secretary ') : <h1>Must be a Secretary</h1>);
};
export default Secretary;
