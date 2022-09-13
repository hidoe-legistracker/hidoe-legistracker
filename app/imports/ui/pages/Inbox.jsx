import React from 'react';
import { Container, Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { PAGE_IDS } from '../utilities/PageIDs';
// import InboxItem from '../components/InboxItem';
// import Button from 'react-bootstrap/Button';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const Inbox = () => (
  <Container id={PAGE_IDS.INBOX} className="py-3">
    <Row className="justify-content-center">
      <Col xs={10}>
        <Row>
          <div>
            <Button href="/create-email" variant="secondary" size="md" style={{ marginTop: 10 }}>Create Email</Button>{' '}
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                      <path
                        fillRule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1
                      1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                      />
                    </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                      <path
                        fillRule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1
                      1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                      />
                    </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                      <path
                        fillRule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1
                      1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                      />
                    </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                      <path
                        fillRule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1
                      1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                      />
                    </svg>
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
