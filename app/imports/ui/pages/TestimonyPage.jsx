import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { useReactToPrint } from 'react-to-print';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Testimony } from '../components/Testimony';

const TestimonyPage = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const { _id } = useParams();

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Button href={`/edit-testimony/${_id}`} variant="secondary" size="sm" className="bill-button-spacing">
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
