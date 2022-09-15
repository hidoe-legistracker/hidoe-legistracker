import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Emails } from '../../api/email/EmailCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';

/* Renders a table containing all of the HI-DOE employees. Use <EmployeeList> to render each row. */
const EmployeeList = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready } = useTracker(() => {
    // Get access to Employees documents.
    const subscription = Email.subscribeEmailAdmin();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Employees documents
    const items = Emails.find({}).fetch();
    return {
      stuffs: items,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container id={PAGE_IDS.MEMBERS} className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center"><h2>Employee List</h2></Col>
          <Table striped bordered hover className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Profile Picture</th>
                <th>Name</th>
                <th>Phone #</th>
                <th>Email</th>
                <th>Employee ID</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="w-25">
                  <img src="https://www.nicepng.com/png/full/933-9332131_profile-picture-default-png.png" className="img-fluid" alt="John Doe Profile Pic" />
                </td>
                <th className="text-center align-middle">John Doe</th>
                <th className="text-center align-middle">(123) 456-7890</th>
                <th className="text-center align-middle">John.Doe@k12.hi.us</th>
                <th className="text-center align-middle">12345678</th>
                <th>
                  <div className="d-grid gap-2 d-md-block">
                    <Link className="profile" to="/profile">
                      <button type="button" className="btn btn-primary btn-lg btn-block">Link to Profile</button>
                    </Link>
                  </div>
                </th>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td className="w-25">
                  <img src="https://www.nicepng.com/png/full/933-9332131_profile-picture-default-png.png" className="img-fluid" alt="John Doe Profile Pic" />
                </td>
                <th className="text-center align-middle">Foo Bar</th>
                <th className="text-center align-middle">(098) 765-4321</th>
                <th className="text-center align-middle">Foo.Bar@k12.hi.us</th>
                <th className="text-center align-middle">00000001</th>
                <th>
                  <div className="d-grid gap-2 d-md-block">
                    <Link className="profile" to="/profile">
                      <button type="button" className="btn btn-primary btn-lg btn-block">Link to Profile</button>
                    </Link>
                  </div>
                </th>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td className="w-25">
                  <img src="https://www.nicepng.com/png/full/933-9332131_profile-picture-default-png.png" className="img-fluid" alt="John Doe Profile Pic" />
                </td>
                <th className="text-center align-middle">Bruce Wayne</th>
                <th className="text-center align-middle">(671) 482-5661</th>
                <th className="text-center align-middle">Bruce.Wayne@k12.hi.us</th>
                <th className="text-center align-middle">25986301</th>
                <th>
                  <div className="d-grid gap-2 d-md-block">
                    <Link className="profile" to="/profile">
                      <button type="button" className="btn btn-primary btn-lg btn-block">Link to Profile</button>
                    </Link>
                  </div>
                </th>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default EmployeeList;
