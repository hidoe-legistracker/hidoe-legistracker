import React from 'react';
import { Container, Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { Trash } from 'react-bootstrap-icons';
import Table from 'react-bootstrap/Table';
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
          <Table>
            <thead>
              <tr>
                <th scope="col">Select</th>
                <th scope="col">Date</th>
                <th scope="col">Sender</th>
                <th scope="col">Subject</th>
              </tr>
            </thead>
            <tbody style={{ marginTop: 5, paddingTop: 5 }}>
              <Link className="table-row" to="/view-bill">
                <th scope="row">
                  <Form>
                    <Form.Check
                      inline
                    />
                  </Form>
                </th>
                <td>12/12/2020</td>
                <td>Jane Smith</td>
                <td>You are assigned this Bill</td>
                <td>
                  <Button size="sm" className="bill-button-spacing">
                    Mark as Read
                  </Button>
                </td>
                <td>
                  <Button variant="danger" size="sm" className="bill-button-spacing">
                    <Trash size={15} />
                  </Button>
                </td>
              </Link>
              <Link className="table-row" to="/view-bill">
                <th scope="row">
                  <Form>
                    <Form.Check
                      inline
                    />
                  </Form>
                </th>
                <td>12/12/2020</td>
                <td>Jane Smith</td>
                <td>You are assigned this Bill</td>
                <td>
                  <Button size="sm" className="bill-button-spacing">
                    Mark as Read
                  </Button>
                </td>
                <td>
                  <Button variant="danger" size="sm" className="bill-button-spacing">
                    <Trash size={15} />
                  </Button>
                </td>
              </Link>
              <Link className="table-row" to="/view-bill">
                <th scope="row">
                  <Form>
                    <Form.Check
                      inline
                    />
                  </Form>
                </th>
                <td>12/12/2020</td>
                <td>Jane Smith</td>
                <td>You are assigned this Bill</td>
                <td>
                  <Button size="sm" className="bill-button-spacing">
                    Mark as Read
                  </Button>
                </td>
                <td>
                  <Button variant="danger" size="sm" className="bill-button-spacing">
                    <Trash size={15} />
                  </Button>
                </td>
              </Link>
              <Link className="table-row" to="/view-bill">
                <th scope="row">
                  <Form>
                    <Form.Check
                      inline
                    />
                  </Form>
                </th>
                <td>12/12/2020</td>
                <td>Jane Smith</td>
                <td>You are assigned this Bill</td>
                <td>
                  <Button size="sm" className="bill-button-spacing">
                    Mark as Read
                  </Button>
                </td>
                <td>
                  <Button variant="danger" size="sm" className="bill-button-spacing">
                    <Trash size={15} />
                  </Button>
                </td>
              </Link>
            </tbody>
          </Table>
        </Row>
      </Col>
    </Row>
  </Container>
);

export default Inbox;
