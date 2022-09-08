import React from 'react';
import { Container, ToggleButton } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { PAGE_IDS } from '../utilities/PageIDs';

/* import { Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import NotAuthorized from "./NotAuthorized"; */

/* Renders a drop down menu  that has a collection of bills that are favorited */
// eslint-disable-next-line no-unused-vars
const MyFolders = () => (
  <Container id={PAGE_IDS.MY_FOLDERS} className="py-3">
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">Folder 1</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Folder 2</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Office</th>
                    <th scope="col">Committee</th>
                    <th scope="col">Description </th>
                    <th scope="col">Hearing Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Notify me for Hearings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">SB 2296</th>
                    <td>OCID, OITS</td>
                    <td>EDU, JDC</td>
                    <td>This bill ...</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>
                      <ToggleButton
                        className="mb-2"
                        id="toggle-check"
                        type="checkbox"
                        variant="outline-primary"
                        value="1"
                      >
                        Checked
                      </ToggleButton>
                    </td>

                  </tr>
                  <tr>
                    <th scope="row">SCR 0028</th>
                    <td>OCID, OITS</td>
                    <td>CPC</td>
                    <td>This bill ...</td>
                    <td>04/14/2022</td>
                    <td>2nd Crossover</td>
                    <td>
                      <ToggleButton
                        className="mb-2"
                        id="toggle-check"
                        type="checkbox"
                        variant="outline-primary"
                        value="1"
                      >
                        Checked
                      </ToggleButton>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">HCR 0053</th>
                    <td>OCID, OITS</td>
                    <td>EDU</td>
                    <td>This bill ...</td>
                    <td>04/05/2022</td>
                    <td>1st Crossover</td>
                    <td>
                      <ToggleButton
                        className="mb-2"
                        id="toggle-check"
                        type="checkbox"
                        variant="outline-primary"
                        value="1"
                      >
                        Checked
                      </ToggleButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Office</th>
                    <th scope="col">Committee</th>
                    <th scope="col">Description </th>
                    <th scope="col">Hearing Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Notify me for Hearings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">HB 1222</th>
                    <td>OCID, OITS, </td>
                    <td>EDN, FIN</td>
                    <td>This bill ...</td>
                    <td>02/09/2021</td>
                    <td>N/A</td>
                    <td>
                      <ToggleButton
                        className="mb-2"
                        id="toggle-check"
                        type="checkbox"
                        variant="outline-primary"
                        value="1"
                      >
                        Checked
                      </ToggleButton>
                    </td>

                  </tr>
                  <tr>
                    <th scope="row">SB 2184</th>
                    <td>OCID, Digital</td>
                    <td>EDU, JDC</td>
                    <td>This bill ...</td>
                    <td>04/28/2022</td>
                    <td>2nd Crossover</td>
                    <td>
                      <ToggleButton
                        className="mb-2"
                        id="toggle-check"
                        type="checkbox"
                        variant="outline-primary"
                        value="1"
                      >
                        Checked
                      </ToggleButton>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">HCR 0040</th>
                    <td>OCID, OITS, OSIP</td>
                    <td>OCID, OSIP</td>
                    <td>This bill ...</td>
                    <td>N/A</td>
                    <td>N/A</td>
                    <td>
                      <ToggleButton
                        className="mb-2"
                        id="toggle-check"
                        type="checkbox"
                        variant="outline-primary"
                        value="1"
                      >
                        Checked
                      </ToggleButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </Container>
);

export default MyFolders;
