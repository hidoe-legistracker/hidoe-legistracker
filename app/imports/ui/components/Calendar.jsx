import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Container, Button, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Calendar3 } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';

const BillCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  // eslint-disable-next-line no-shadow
  const onChange = date => {
    setDate(date);
  };

  return (
    <>
      <Button variant="outline-secondary" onClick={() => setShow(true)} style={{ outline: 'none' }}>
        <Calendar3 size={25} />
      </Button>

      <Container>
        <Modal
          show={show}
          centered
          onHide={() => setShow(false)}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Modal.Title>Bill Calendar</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ height: '50vh', alignContent: 'center' }}>
            <Calendar onChange={onChange} value={date} />

            <Row style={{ marginTop: 10, justifyContent: 'center' }}>
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
