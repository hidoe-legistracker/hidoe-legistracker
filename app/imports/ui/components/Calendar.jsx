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
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Hearings } from '../../api/hearing/HearingCollection';

const BillCalendar = () => {
  const [show, setShow] = useState(false);
  const { _id } = useParams();
  const { hearings } = useTracker(() => {
    const hearingSubscription = Hearings.subscribeHearings();
    const ready = hearingSubscription.ready();
    const hearingCollection = Hearings.find({}, {}).fetch();
    return {
      hearings: hearingCollection,
      ready: ready,
    };
  }, [_id]);
  const events = [];
  const updateHearings = () => {
    let str = '';
    hearings.forEach(id => {
      const newEvent = {
        id: 0,
        title: '',
        start: '',
        end: '',
        date: '',
        room: '',
        type: '',
      };
      str = id.datetime;
      const time = str.split(', ');
      time.shift();
      time.join().substring(0, -2);
      const date = new Date(time);
      newEvent.id = events.length;
      newEvent.title = id.measureNumber.toString();
      newEvent.start = date.toISOString();
      newEvent.end = date.toISOString();
      newEvent.room = id.room;
      newEvent.type = id.measureType;
      newEvent.date = date.toString();
      events.push(newEvent);
    });
    return (events);
  };
  return (
    <>
      <Button variant="outline-secondary" onClick={() => { setShow(true); }} className="calendar-button">
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
                  click: () => console.log(events.room),
                },
              }}
              events={updateHearings()}
              eventColor="red"
              nowIndicator
              dateClick={(e) => console.log(e.dateStr)}
              eventClick={(e) => console.log(e.event.title)}
              contentHeight={450}
              selectable
              selectMirror
              dragScroll
            />

            <Row style={{ marginTop: 10, justifyContent: 'center' }}>
              {updateHearings().map(
                (event, key) => (
                  <Card style={{ width: '18rem', margin: 5 }} key={key}>
                    <Card.Body>
                      <Card.Title>Bill: {event.title}</Card.Title>
                      <Card.Text>Date & Time: {event.date}</Card.Text>
                      <Card.Text>Location: {event.room}</Card.Text>
                      <Card.Text>Type: {event.type}</Card.Text>
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
