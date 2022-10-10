import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Container, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

const BillCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  // eslint-disable-next-line no-shadow
  const onChange = date => {
    setDate(date);
  };

  return (
    <Container style={{ alignContent: 'center' }}>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Bill Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calendar onChange={onChange} value={date} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BillCalendar;
