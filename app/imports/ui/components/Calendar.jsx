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
import _ from 'underscore';
import { Link, NavLink } from 'react-router-dom';
import { Hearings } from '../../api/hearing/HearingCollection';
import { Measures } from '../../api/measure/MeasureCollection';

const BillCalendar = () => {
  const [show, setShow] = useState(false);
  const { n } = useParams();
  const { hearings, measure } = useTracker(() => {
    const hearingSubscription = Hearings.subscribeHearings();
    const measureSubscription = Measures.subscribeMeasures();
    const hearingCollection = Hearings.find({}, {}).fetch();
    const measureItem = Measures.find({}, {}).fetch();
    const isReady = hearingSubscription.ready() && measureSubscription.ready();
    return {
      hearings: hearingCollection,
      measure: measureItem,
      ready: isReady,
    };
  }, [n]);

  const getHearings = _.uniq(hearings, false, (hearing) => hearing.notice);
  const cardStyle = { padding: 15, margin: 10, width: '18rem' };

  const getBills = (noticeID) => {
    const notice = _.where(hearings, { notice: noticeID });
    return _.pluck(notice, 'measureNumber');
  };

  const getBillInfo = (num) => _.find(measure, function (m) { return m.measureNumber === num; });
  const events = [];
  const updateEvent = () => {
    let str = '';
    getHearings.forEach(id => {
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
      newEvent.title = id.room;
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
              events={updateEvent()}
              eventColor="red"
              nowIndicator
              dateClick={(e) => console.log(e.dateStr)}
              eventClick={(e) => console.log(e.event.title)}
              contentHeight={450}
              timeZone="local"
              selectable
              selectMirror
              dragScroll
            />

            <Row style={{ marginTop: 10, justifyContent: 'center' }}>
              {getHearings?.map(
                (hearing, key) => (
                  <Card style={cardStyle}>
                    <Link style={{ color: 'black' }} as={NavLink} exact="true" to={`/hearing-notice/${hearing.notice}`} key={key} onClick={() => setShow(false)}>
                      <Card.Title>{hearing.datetime}</Card.Title>
                      <Card.Subtitle style={{ paddingTop: 5, paddingBottom: 5, fontWeight: 'normal' }}>{hearing.room}</Card.Subtitle>
                    </Link>
                    <Card.Footer style={{ textAlign: 'center' }}>
                      <h6>Bills on Agenda</h6>
                      {getBills(hearing.notice).map(m => (
                        <Link style={{ color: 'black' }} as={NavLink} exact to={`/view-bill/${getBillInfo(m)?._id}`} onClick={() => setShow(false)}>
                          {`${getBillInfo(m)?.measureNumber} `}
                        </Link>
                      ))}
                    </Card.Footer>
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
