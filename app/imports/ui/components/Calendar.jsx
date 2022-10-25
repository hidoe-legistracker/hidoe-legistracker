import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Container, Button, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { Calendar3, CardText } from 'react-bootstrap-icons';
import Card from 'react-bootstrap/Card';
import _ from 'underscore';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Hearings } from '../../api/hearing/HearingCollection';

const BillCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  // eslint-disable-next-line no-shadow
  const onChange = date => {
    setDate(date);
  };

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
            <Calendar onChange={onChange} value={date} />

            <Row style={{ marginTop: 10, justifyContent: 'center' }}>
              {getHearings.map(
                (hearing) => (
                  <Card style={{ width: '18rem', margin: 5 }}>
                    <Card.Body>
                      <Card.Title>{hearing}</Card.Title>
                      <Card.Text>Hearing Date & Time:</Card.Text>
                      <Card.Text>
                        Hearing Location: <Row>{getHearings.datetime}</Row>
                      </Card.Text>
                      <Card.Text>
                        Hearing Type:
                      </Card.Text>
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
