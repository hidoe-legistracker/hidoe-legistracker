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

  const { _id } = useParams();
  const { measures, testimony, ready } = useTracker(() => {
    const testimonySubscription = Testimonies.subscribeTestimony();
    const measureSubscription = Measures.subscribeMeasures();
    const rdy = testimonySubscription.ready() && measureSubscription.ready();
    const testimonyDoc = Testimonies.findOne({ _id: _id });
    const measureData = Measures.find().fetch();
    return {
      measures: measureData,
      testimony: testimonyDoc,
      ready: rdy,
    };
  }, [_id]);

  function getBillTitle(billNumber) {
    const index = measures.map(function (measure) { return measure.measureNumber; }).indexOf(billNumber);
    if (index !== -1) {
      return measures[index].measureType.toUpperCase().concat(measures[index].measureNumber);
    }
    return '';
  }

  function getBillDescription(billNumber) {
    const index = measures.map(function (measure) { return measure.measureNumber; }).indexOf(billNumber);
    if (index !== -1) {
      return measures[index].description;
    }
    return '';
  }

  return ready ? (
    <div>
      <Container id={PAGE_IDS.VIEW_TESTIMONY} className="view-testimony-container">
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
            measureTitle: (testimony.billNumber ? getBillTitle(testimony.billNumber) : ''),
            measureDescription: (testimony.billNumber ? getBillDescription(testimony.billNumber) : '') }}
        />
      </Container>
    </div>
  ) : <LoadingSpinner message="Loading Testimony" />;
};

export default TestimonyPage;
