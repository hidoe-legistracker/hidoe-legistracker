import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { useReactToPrint } from 'react-to-print';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Testimony } from '../components/Testimony';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import LoadingSpinner from '../components/LoadingSpinner';

const TestimonyPage = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { measureID, testimonyID } = useParams();
  const { measure, testimony, ready } = useTracker(() => {
    const testimonySubscription = Testimonies.subscribeTestimony();
    const measureSubscription = Measures.subscribeMeasures();
    const rdy = testimonySubscription.ready() && measureSubscription.ready();
    const testimonyDoc = Testimonies.findOne({ _id: testimonyID });
    const measureDoc = Measures.findOne({ _id: measureID });
    return {
      measure: measureDoc,
      testimony: testimonyDoc,
      ready: rdy,
    };
  }, [measureID, testimonyID]);

  return ready ? (
    <div>
      <Container id={PAGE_IDS.VIEW_TESTIMONY} className="view-testimony-container">
        <Row>
          <Col>
            <Button href={`/edit-testimony/${measureID}/${testimonyID}`} variant="secondary" size="sm" className="bill-button-spacing">
              Edit
            </Button>
            <Button onClick={handlePrint} variant="secondary" size="sm" className="bill-button-spacing">
              Print / Save
            </Button>
          </Col>
        </Row>
        <Testimony
          ref={componentRef}
          testimony={{ hearingDate: (testimony.hearingDate ? testimony.hearingDate.toLocaleDateString() : '-'),
            hearingTime: (testimony.hearingDate ? testimony.hearingDate.toLocaleTimeString() : '-'),
            hearingLocation: (testimony.hearingLocation ? testimony.hearingLocation : '-'),
            committeeName: (testimony.committeeName ? testimony.committeeName : '-'),
            department: '-',
            testifier: (testimony.testifier ? testimony.testifier : ' '),
            introduction: (testimony.introduction ? testimony.introduction : ''),
            content: (testimony.content ? testimony.content : ''),
            closing: (testimony.closing ? testimony.closing : ''),
            measureTitle: (testimony.billNumber ? measure.measureType.toUpperCase().concat(measure.measureNumber) : ''),
            measureDescription: (testimony.billNumber ? measure.description : '') }}
        />
      </Container>
    </div>
  ) : <LoadingSpinner message="Loading Testimony" />;
};

export default TestimonyPage;
