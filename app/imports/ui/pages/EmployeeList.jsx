import React from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';

/* Renders a table containing all of the Stuff documents. Use <StuffItemAdmin> to render each row. */
const EmployeeList = () => (
  <Container id={PAGE_IDS.MEMBERS} className="py-3">
    <Row className="justify-content-center">
      <Col md={7}>
        <Col className="text-center"><h2>Employee List</h2></Col>
        <Table striped bordered hover className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Phone #</th>
              <th>Email</th>
              <th>Employee ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <a href="/profile" className="row-link">
                  <div className="d-grid gap-2 d-md-block text-center">
                    <img src="https://www.nicepng.com/png/full/933-9332131_profile-picture-default-png.png" className="img-fluid" alt="John Doe Profile Pic" width={50} />
                  </div>
                </a>
              </td>
              <td className="text-center align-middle" width={150}>John Doe
              </td>
              <td className="text-center align-middle" width={150}>(123) 456-7890
              </td>
              <td className="text-center align-middle">John.Doe@k12.hi.us
              </td>
              <td className="text-center align-middle">12345678
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>
                <div className="d-grid gap-2 d-md-block text-center">
                  <Link className="profile" to="/profile">
                    <img src="https://www.nicepng.com/png/full/933-9332131_profile-picture-default-png.png" className="img-fluid" alt="John Doe Profile Pic" width={50} />
                  </Link>
                </div>
              </td>
              <th className="text-center align-middle">Foo Bar</th>
              <th className="text-center align-middle">(098) 765-4321</th>
              <th className="text-center align-middle">Foo.Bar@k12.hi.us</th>
              <th className="text-center align-middle">00000001</th>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>
                <div className="d-grid gap-2 d-md-block text-center">
                  <Link className="profile" to="/profile">
                    <img src="https://www.nicepng.com/png/full/933-9332131_profile-picture-default-png.png" className="img-fluid" alt="John Doe Profile Pic" width={50} />
                  </Link>
                </div>
              </td>
              <th className="text-center align-middle">Bruce Wayne</th>
              <th className="text-center align-middle">(671) 482-5661</th>
              <th className="text-center align-middle">Bruce.Wayne@k12.hi.us</th>
              <th className="text-center align-middle">25986301</th>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  </Container>
);

export default EmployeeList;
