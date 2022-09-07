import React from 'react';
import { Container, ToggleButton } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
/* import { Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import NotAuthorized from "./NotAuthorized"; */

/* Renders a drop down menu  that has a collection of bills that are favorited */
// eslint-disable-next-line no-unused-vars
const MyFolders = () => (
  <Container id={PAGE_IDS.MY_FOLDERS} className="py-3">
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
          <th scope="row">SB 2296</th>
          <td>OCID, OITS</td>
          <td>EDU, JDC</td>
          <td>This bill ...</td>
          <td>N/A</td>
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
          <th scope="row">SB 2296</th>
          <td>OCID, OITS</td>
          <td>EDU, JDC</td>
          <td>This bill ...</td>
          <td>N/A</td>
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
      </tbody>
    </table>
  </Container>
);

export default MyFolders;
