import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Testimony } from '../components/Testimony';

const TestimonyPage = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Button href="/edit-testimony" variant="secondary" size="sm" className="bill-button-spacing">
              Edit
            </Button>
            <Button onClick={handlePrint} variant="secondary" size="sm" className="bill-button-spacing">
              Print / Save
            </Button>
          </Col>
        </Row>
        <Testimony ref={componentRef} />
      </Container>
    </div>
  );
};

export default TestimonyPage;
