import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Container, Button, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Calendar3 } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import _ from 'underscore';
import Table from 'react-bootstrap/Table';
import { Link, NavLink } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import { ROLE } from '../../api/role/Role';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { Hearings } from '../../api/hearing/HearingCollection';
import { Measures } from '../../api/measure/MeasureCollection';

const BillCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  // eslint-disable-next-line no-shadow
  const onChange = date => {
    setDate(date);
  };

  const { currentUser, ready, init, measure, hearings } = useTracker(() => {
    const username = Meteor.user() ? Meteor.user().username : '';
    let rdy;
    let usr;
    if (Roles.userIsInRole(Meteor.userId(), [ROLE.USER])) {
      const subscription = UserProfiles.subscribe();
      rdy = subscription.ready();
      usr = UserProfiles.findByEmail(username);
    } else {
      const subscription = AdminProfiles.subscribe();
      rdy = subscription.ready();
      usr = AdminProfiles.findByEmail(username);
    }
    const hearingSub = Hearings.subscribeHearings();
    const subscription = Measures.subscribeMeasures();
    const isReady = subscription.ready() && hearingSub.ready();
    const measureData = Measures.find({}, {}).fetch();
    const hearingData = Hearings.find({}, {}).fetch();
    return {
      hearings: hearingData,
      currentUser: usr,
      ready: isReady,
      init: rdy,
      measure: measureData,
    };
  }, []);

  const getHearings = _.uniq(_.pluck(hearings, 'notice'));

  return (
    <>
      <Button variant="outline-secondary" onClick={() => setShow(true)} className="calendar-button">
        <Calendar3 size={25} />
      </Button>

      <Tab eventKey="hearings" title="Hearings">
        <Table className="directory-table">
          <tbody style={{ position: 'relative' }}>
            {getHearings.map(
              (hearing) => (
                <Link className="table-row" style={{ border: 'none' }} as={NavLink} exact="true" to={`/hearing-notice/${hearing}`}>
                  {hearing}
                </Link>
              ),
            )}
          </tbody>
        </Table>
      </Tab>

      <Container>
        <Modal
          show={show}
          onHide={() => setShow(false)}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Modal.Title>Bill Calendar</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ alignContent: 'center' }}>
            <Calendar onChange={onChange} value={date} />

            <Row style={{ marginTop: 10, justifyContent: 'center' }}>
              <Card style={{ width: '18rem', margin: 5 }}>
                <Card.Body>
                  <Card.Title />
                  <Card.Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card style={{ width: '18rem', margin: 5 }}>
                <Card.Body>
                  <Card.Title>Bill #1</Card.Title>
                  <Card.Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card style={{ width: '18rem', margin: 5 }}>
                <Card.Body>
                  <Card.Title>Bill #1</Card.Title>
                  <Card.Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Card.Text>
                </Card.Body>
              </Card>

              <Card style={{ width: '18rem', margin: 5 }}>
                <Card.Body>
                  <Card.Title>Bill #1</Card.Title>
                  <Card.Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>

          </Modal.Body>
        </Modal>
      </Container>
    </>

  );
};

export default BillCalendar;
