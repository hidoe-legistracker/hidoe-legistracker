import React from 'react';
import {
  Container,
  Row,
  ListGroup,
  Col,
  Form,
  Alert,
  DropdownButton,
  Dropdown,
  Button, Accordion, Badge,
} from 'react-bootstrap';

import { useParams } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Measures } from '../../api/measure/MeasureCollection';
import LoadingSpinner from '../components/LoadingSpinner';

const MonitoringReport = () => {
  const { _id } = useParams();
  const newDate = new Date();
  const date = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();

  const { measure, ready, currentUser } = useTracker(() => {
    const measureSubscription = Measures.subscribeMeasures();
    const username = Meteor.user() ? Meteor.user().username : '';
    let userReady;
    let usr;
    if (Roles.userIsInRole(Meteor.userId(), [ROLE.USER])) {
      const subscription = UserProfiles.subscribe();
      userReady = subscription.ready();
      usr = UserProfiles.findByEmail(username);
    } else {
      const subscription = AdminProfiles.subscribe();
      userReady = subscription.ready();
      usr = AdminProfiles.findByEmail(username);
    }
    const rdy = measureSubscription.ready() && userReady;

    const measureItem = Measures.findOne({ _id: _id }, {});
    return {
      currentUser: usr,
      measure: measureItem,
      ready: rdy,
    };
  }, [_id]);

  return (ready ? (
    <Container id={PAGE_IDS.MONITORING_REPORT} className="py-3">
      <Row className="mb-5">
        <Col className="align-left">
          <ListGroup horizontal="sm">
            <ListGroup.Item><strong>Date: </strong> {`${month}/${date}/${year}`} </ListGroup.Item>
            <ListGroup.Item><strong>Time: </strong> {`${newDate.getHours()}:${newDate.getMinutes()}`} </ListGroup.Item>
            <ListGroup.Item><strong>Location: </strong> CR 229 </ListGroup.Item>
            <ListGroup.Item><strong>Committee: </strong> {measure.currentReferral} </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col>
          <Form>
            <Form.Check
              type="radio"
              label="Written Only"
              name="writeOptions"
            />
            <Form.Check
              type="radio"
              label="Written Comments"
              name="writeOptions"
            />
          </Form>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col className="align-center">
          <ListGroup>
            <ListGroup.Item><strong>Department: </strong>Education </ListGroup.Item>
            <ListGroup.Item><strong>Testifier: </strong> Keith T. Hayashi Interim Superintendent of Education </ListGroup.Item>
            <ListGroup.Item><strong>Title of Bill: </strong> {measure.measureTitle} </ListGroup.Item>
            <ListGroup.Item><strong>Purpose of Bill: </strong> {measure.description} </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row className="mb-5">
        <Form>
          <Form.Group className="mb-2">
            <Form.Check
              type="radio"
              label="Support"
              name="supportOptions"
            />
            <Form.Check
              type="radio"
              label="Oppose"
              name="supportOptions"
            />
            <Form.Check
              type="radio"
              label="Comments"
              name="supportOptions"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              placeholder="Start Testimony Here"
            />
          </Form.Group>
          <Form.Group className="mb-5">
            <Form.Control type="file" className="mb-2" />
            <Alert key="danger" variant="danger">
              <u>Directions:</u> After completing testimony, identify who to route the testimony to in the field below, then click on <u>Route</u> button.
            </Alert>
          </Form.Group>
          <Form.Group className="mb-2">
            <Alert key="primary" variant="primary">
              <u>Comments:</u> (Include date & initials)
            </Alert>
            <Form.Control as="textarea" />
          </Form.Group>
          <Form.Group className="mb-2">
            <strong className="text-primary">Route Testimony to:</strong>
            <DropdownButton drop="end" className="mb-2">
              <Dropdown.Item>Name 1</Dropdown.Item>
              <Dropdown.Item>Name 2</Dropdown.Item>
              <Dropdown.Item>Name 3</Dropdown.Item>
              <Dropdown.Item>Name 4</Dropdown.Item>
            </DropdownButton>
          </Form.Group>
          <Form.Group className="mb-2">
            <Button className="me-2">Route for Office Review</Button>
            <Button variant="secondary">Route to PIPE</Button>
          </Form.Group>
          <Form.Group className="mb-5 text-secondary text-sm">
            Status:
            <Form.Check
              type="radio"
              label="Active"
              name="StatusOptions"
            />
            <Form.Check
              type="radio"
              label="Inactive"
              name="StatusOptions"
            />
            Action: Testimony<br />
            Office: OCID, OITS, OTM, OFS, DEPUTY<br />
            Assigned to: {measure.currentReferral}<br />
            Action By: CN-Charles Souza/OU-OCID/O*HIDOE*CN-Raymond Fujino/OU-OCID/O*HIDOE<br />
            Secretary: CN-Christol Allen/OU-OCID/O*HIDOE*CN-Saloua Adjir/OU-OCID/O*HIDOE<br />
          </Form.Group>
          <Form.Group>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Review Section</Accordion.Header>
                <Accordion.Body>
                  <Form.Control className="mb-2" as="textarea" placeholder="Comments: This will show on disapproval email notice." />
                  <Button className="me-2">Route to Final Approver</Button>
                  <Button variant="danger">Send back to lead office for additional edits</Button>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Approval Section</Accordion.Header>
                <Accordion.Body className="text-danger">
                  <u>Final Approval Directions</u><br />
                  Review and Edit Testimony as necessary. To reroute back to person change name in <strong>Route testimony to: </strong> field and click on
                  <strong> Save & Route... above.</strong><br />
                  <strong>Final Approval Given</strong> for Supts office below.<br />
                  <Badge bg="primary">Status: New</Badge>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Form.Group>
        </Form>
      </Row>
      <Row className="mb-5">
        <Col>
          <ListGroup variant="flush">
            <ListGroup.Item className="text-secondary">Created by: Brandon Lee/OSIP/HIDOE </ListGroup.Item>
            <ListGroup.Item className="text-secondary">Created on: 08/25/2022 1:48:59</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col>
          <ListGroup variant="flush">
            <ListGroup.Item>Last Edited By: {currentUser.firstName} {currentUser.lastName}</ListGroup.Item>
            <ListGroup.Item>Date: {`${month}/${date}/${year}`} {`${newDate.getHours()}:${newDate.getMinutes()}`}</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  ) :
    <LoadingSpinner message="Loading Monitoring Report" />
  );
};

export default MonitoringReport;
