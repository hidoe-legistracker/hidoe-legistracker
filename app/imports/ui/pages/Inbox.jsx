import React from 'react';
import { Container, Tab, Row, Col, Nav } from 'react-bootstrap';
import InboxItem from '../components/InboxItem';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const Inbox = () => (
  <Container id={PAGE_IDS.INBOX} style={{ marginTop: '50px' }}>
    <h1 style={{ textAlign: 'left' }}>Your Mail</h1>
    <Tab.Container defaultActiveKey="inbox">
      <Row>
        <Col xs={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="inbox">Inbox</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="unread">Unread</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col>
          <Tab.Content>
            <Tab.Pane eventKey="inbox">
              <InboxItem item={{ from: 'John Foo', subject: 'Testimony Added', time: '8:50 PM' }} />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </Container>
);

export default Inbox;
