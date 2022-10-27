import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { Container, Button, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Calendar3 } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const BillCalendar = () => {
  const [show, setShow] = useState(false);
  const events = [
    {
      id: 1,
      title: 'event 1',
      start: '2022-10-25T10:00:00',
      end: '2022-10-25T12:00:00',
    },
    {
      id: 2,
      title: 'event 2',
      start: '2022-10-22T13:00:00',
      end: '2022-10-22T18:00:00',
    },
    { id: 3, title: 'event 3', start: '2022-10-25', end: '2022-10-26' },
  ];

  return (
    <>
      <Button variant="outline-secondary" onClick={() => setShow(true)} className="calendar-button">
        <Calendar3 size={25} />
      </Button>

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
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                center: 'dayGridMonth,timeGridWeek,timeGridDay new',
              }}
              customButtons={{
                new: {
                  text: 'new',
                  click: () => console.log('new event'),
                },
              }}
              events={events}
              eventColor="red"
              nowIndicator
              dateClick={(e) => console.log(e.dateStr)}
              eventClick={(e) => console.log(e.event.id)}
              contentHeight={450}
              selectable
              selectMirror
              dragScroll
            />

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
