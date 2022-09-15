import React from 'react';
import { Container, Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Trash } from 'react-bootstrap-icons';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
// import InboxItem from '../components/InboxItem';
// import Button from 'react-bootstrap/Button';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const Inbox = () => (
  <Container id={PAGE_IDS.INBOX} className="py-3">
    <Row className="justify-content-center">
      <Col xs={10}>
        <Row>
          <div>
            <Button id={COMPONENT_IDS.INBOX_CREATE_EMAIL_BUTTON} href="/create-email" variant="secondary" size="md" style={{ marginTop: 10 }}>Create Email</Button>{' '}
          </div>
          <div>
            <h3 align="center">Bill Updates</h3>
          </div>
          <div className="bill-table-header">
            <Row>
              <Col sm="auto">Select</Col>
              <Col sm="auto">Date</Col>
              <Col sm="auto">Sender</Col>
              <Col sm="auto">Subject/Content</Col>
            </Row>
          </div>
          <div className="d-grid gap-2">
            <Link className="bill-table" to="/view-bill">
              <Row>
                <Col sm="auto">
                  <Form>
                    <Form.Check
                      inline
                    />
                  </Form>
                </Col>
                <Col sm="auto">12/12/2020</Col>
                <Col sm="auto">Jane Smith</Col>
                <Col sm="auto">You are Assigned this testimony</Col>
                <Col sm="auto">
                  <Button size="sm" className="bill-button-spacing">
                    Mark as Read
                  </Button>
                </Col>
                <Col sm="auto">
                  <Button variant="danger" size="sm" className="bill-button-spacing">
                    <Trash size={15} />
                  </Button>
                </Col>
              </Row>
            </Link>
            <Link className="bill-table" to="/view-bill">
              <Row>
                <Col sm="auto">
                  <Form>
                    <Form.Check
                      inline
                    />
                  </Form>
                </Col>
                <Col sm="auto">12/12/2020</Col>
                <Col sm="auto">Jane Smith</Col>
                <Col sm="auto">You are Assigned this testimony</Col>
                <Col sm="auto">
                  <Button size="sm" className="bill-button-spacing">
                    Mark as Read
                  </Button>
                </Col>
                <Col sm="auto">
                  <Button variant="danger" size="sm" className="bill-button-spacing">
                    <Trash size={15} />
                  </Button>
                </Col>
              </Row>
            </Link>
            <Link className="bill-table" to="/view-bill">
              <Row>
                <Col sm="auto">
                  <Form>
                    <Form.Check
                      inline
                    />
                  </Form>
                </Col>
                <Col sm="auto">12/12/2020</Col>
                <Col sm="auto">Jane Smith</Col>
                <Col sm="auto">You are Assigned this testimony</Col>
                <Col sm="auto">
                  <Button size="sm" className="bill-button-spacing">
                    Mark as Read
                  </Button>
                </Col>
                <Col sm="auto">
                  <Button variant="danger" size="sm" className="bill-button-spacing">
                    <Trash size={15} />
                  </Button>
                </Col>
              </Row>
            </Link>
            <Link className="bill-table" to="/view-bill">
              <Row>
                <Col sm="auto">
                  <Form>
                    <Form.Check
                      inline
                    />
                  </Form>
                </Col>
                <Col sm="auto">12/12/2020</Col>
                <Col sm="auto">Automated</Col>
                <Col sm="auto"> [NOTIFICATION] Bill is Updated</Col>
                <Col sm="auto">
                  <Button size="sm" className="bill-button-spacing">
                    Mark as Read
                  </Button>
                </Col>
                <Col sm="auto">
                  <Button variant="danger" size="sm" className="bill-button-spacing">
                    <Trash size={15} />
                  </Button>
                </Col>
              </Row>
            </Link>
          </div>
        </Row>
      </Col>
    </Row>
  </Container>
);

export default Inbox;
