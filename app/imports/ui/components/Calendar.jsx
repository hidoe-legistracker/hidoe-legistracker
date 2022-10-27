import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { Container, Button, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Calendar3 } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import _ from 'underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Hearings } from '../../api/hearing/HearingCollection';

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

  const n = useParams();

  const { hearings } = useTracker(() => {
    const hearingData = Hearings.find({}, {}).fetch();

    return {
      hearings: hearingData,
    };
  }, [n]);

  const getHearings = _.uniq(_.pluck(hearings, 'notice'));

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
            <Modal.Title>Hearing Calendar</Modal.Title>
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
              {getHearings.map(
                (hearing, index) => (
                  <Card style={{ width: '18rem', margin: 5 }}>
                    <Card.Body eventKey={index}>
                      <Card.Title>{hearing}</Card.Title>
                      <Card.Text>Date & Time:</Card.Text>
                      <Card.Text>Location:</Card.Text>
                      <Card.Text>Type:</Card.Text>
                    </Card.Body>
                  </Card>
                ),
              )}
            </Row>

          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default BillCalendar;
