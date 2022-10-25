import React from 'react';
import { Container, Row, ListGroup, Col, Form, Breadcrumb, Badge } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import _ from 'underscore/underscore-node';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import { Measures } from '../../api/measure/MeasureCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import CreateTestimonyModal from '../components/CreateTestimonyModal';

const MonitoringReport = () => {
  const { _id } = useParams();

  const { measure, ready, testimonies, user } = useTracker(() => {
    const measureSubscription = Measures.subscribeMeasures();
    const testimonySubscription = Testimonies.subscribeTestimony();
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = measureSubscription.ready() && testimonySubscription.ready() && userSubscription.ready() && adminSubscription.ready();

    const username = Meteor.user() ? Meteor.user().username : '';

    const measureItem = Measures.findOne({ _id: _id }, {});
    const testimonyCollection = Testimonies.find({}, {}).fetch();
    let usr = UserProfiles.findOne({ email: username });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: username });
    }
    return {
      measure: measureItem,
      testimonies: testimonyCollection,
      user: usr,
      ready: rdy,
    };
  }, [_id]);

  return ready ? (
    <div>
      <Container>
        <Row>
          <Breadcrumb>
            <Breadcrumb.Item href="/directory">Directory</Breadcrumb.Item>
            <Breadcrumb.Item href={`/view-bill/${_id}`}>View Bill</Breadcrumb.Item>
            <Breadcrumb.Item active>Monitoring Report</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
      </Container>
      <Container id={PAGE_IDS.MONITORING_REPORT} className="view-bill-container" style={{ marginTop: 0 }}>
        <Container style={{ padding: 20 }}>
          <Row className="mb-5">
            <Col className="align-left">
              <ListGroup horizontal="sm">
                <ListGroup.Item><strong>Bill #: </strong> {measure.measureNumber} </ListGroup.Item>
                <ListGroup.Item><strong>Date: </strong> {`${measure.lastUpdated.getMonth() + 1}/${measure.lastUpdated.getDate()}/${measure.lastUpdated.getFullYear()}`} </ListGroup.Item>
                <ListGroup.Item><strong>Time: </strong> {`${measure.lastUpdated.getHours()}:${measure.lastUpdated.getMinutes() < 10 ? `0${measure.lastUpdated.getMinutes()}` : measure.lastUpdated.getMinutes()}`} </ListGroup.Item>
                <ListGroup.Item><strong>Location: </strong> CR 229 </ListGroup.Item>
                <ListGroup.Item><strong>Committee: </strong> {measure.currentReferral} </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col className="align-center">
              <ListGroup>
                <ListGroup.Item><strong>Department: </strong>Education </ListGroup.Item>
                <ListGroup.Item><strong>Title of Bill: </strong> {measure.measureTitle} </ListGroup.Item>
                <ListGroup.Item><strong>Purpose of Bill: </strong> {measure.description} </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mb-5">
            <Form>
              <Form.Group className="mb-2">
                <CreateTestimonyModal testimonyDefaultData={{ measureNumber: measure.measureNumber }} />
              </Form.Group>

            </Form>
          </Row>
          <Container className="view-testimony-container">
            {/* eslint-disable-next-line no-nested-ternary */}
            <h3>{_.where(testimonies, { billNumber: measure.measureNumber }).length === 0 ? 'No testimonies available' : user.offices.length !== 0 ?
              (`Submitted testimonies for ${user.offices.map(office => (` ${office}`))}`) : 'Submitted Testimonies'}
            </h3>
            {_.where(testimonies, { billNumber: measure.measureNumber }).length === 0 ? '' : (
              <Table>
                <thead>
                  <tr>
                    <th scope="col">Hearing Date</th>
                    <th scope="col">Bill #</th>
                    <th scope="col">Prepared By</th>
                    <th scope="col">Office</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {_.where(testimonies, { billNumber: measure.measureNumber }).map(testimony => (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>
                      { testimony.testimonyProgress.length !== 6 && testimony.office === user.offices.find(element => element === testimony.office) ? (
                        <Link className="table-row" to={`/view-testimony/${measure._id}&${testimony._id}`}>
                          <th scope="row">{testimony.hearingDate ? testimony.hearingDate.toLocaleDateString() : '-'}</th>
                          <td>{testimony.billNumber}</td>
                          <td>{testimony.testifier}</td>
                          <td>{testimony.office}</td>
                          <td>
                            {testimony.testimonyProgress.length === 6 ? <Badge bg="secondary">Completed</Badge> : ''}
                            {testimony.testimonyProgress.length === 5 ? <Badge bg="primary">Finalizing Testimony</Badge> : ''}
                            {testimony.testimonyProgress.length === 4 ? <Badge bg="warning">Waiting for Final Approval</Badge> : ''}
                            {testimony.testimonyProgress.length === 3 ? <Badge bg="success">Waiting for PIPE Approval</Badge> : ''}
                            {testimony.testimonyProgress.length === 2 ? <Badge bg="primary">Waiting for Office Approval</Badge> : ''}
                            {testimony.testimonyProgress.length === 1 ? <Badge bg="secondary">Testimony being written</Badge> : ''}
                          </td>
                        </Link>
                      )

                        : '' }
                    </>
                  ))}
                </tbody>
              </Table>
            )}
          </Container>
          <Row>
            <Col>
              <ListGroup variant="flush">
                <ListGroup.Item className="text-secondary">Last accessed by: {`${Meteor.user().username}`}</ListGroup.Item>
                {/* eslint-disable-next-line max-len */}
                <ListGroup.Item className="text-secondary">Last updated on:  {`${measure.lastUpdated.getMonth() + 1}/${measure.lastUpdated.getDate()}/${measure.lastUpdated.getFullYear()}`} {`${measure.lastUpdated.getHours()}:${measure.lastUpdated.getMinutes() < 10 ? `0${measure.lastUpdated.getMinutes()}` : measure.lastUpdated.getMinutes()}`}</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  ) : <LoadingSpinner />;
};

export default MonitoringReport;
