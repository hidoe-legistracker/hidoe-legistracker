import React from 'react';
import { Container, ProgressBar } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';
import { PAGE_IDS } from '../utilities/PageIDs';

/* Renders a drop down menu  that has a collection of bills that are favorited */
// eslint-disable-next-line no-unused-vars

const billProgress = 60;

const MyFolders = () => (
  <Container id={PAGE_IDS.MY_FOLDERS} className="py-3">
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">DOE</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Deputy</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9} className="overflow-auto">
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <Col xs={12}>
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
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <Col xs={12}>
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
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </Container>
);

export default MyFolders;
