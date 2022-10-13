import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { useReactToPrint } from 'react-to-print';
import { Breadcrumb, Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap';
import swal from 'sweetalert';

import { Testimony } from '../components/Testimony';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { updateMethod } from '../../api/base/BaseCollection.methods';

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

  const submit = (type) => {
    if (type === 'approve') {
      testimony.testimonyProgress.push(0);
    }
    if (type === 'reject') {
      testimony.testimonyProgress.pop();
    }
    const testimonyProgress = testimony.testimonyProgress;

    console.log(testimonyProgress);
    const collectionName = Testimonies.getCollectionName();
    const updateData = { id: testimonyID, testimonyProgress };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        if (type === 'approve') {
          swal('Success', 'Testimony Approved', 'success');
        } else {
          swal('Success', 'Testimony Rejected', 'success');
        }
      });

  };

  const finalConfirmation = () => {
    swal({
      title: 'Are you sure?',
      text: 'Once testimony is finalized, you will not be able to edit it.',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        submit('approve');
      }
    });

  };

  return ready ? (
    <div>
      <Container>
        <Row>
          <Breadcrumb>
            <Breadcrumb.Item href="/directory">Directory</Breadcrumb.Item>
            <Breadcrumb.Item href={`/view-bill/${measureID}`}>View Bill</Breadcrumb.Item>
            <Breadcrumb.Item active>View Testimony</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
      </Container>
      <Container id={PAGE_IDS.VIEW_TESTIMONY} className="view-testimony-container">
        <Row>
          <Col>
            <Button onClick={handlePrint} variant="secondary" size="sm" className="bill-button-spacing">
              Print / Save
            </Button>
            { testimony.testimonyProgress.length !== 6 ? (
              <Button href={`/edit-testimony/${measureID}&${testimonyID}`} variant="secondary" size="sm" className="bill-button-spacing">
                Edit
              </Button>
            ) : ''}
            { testimony.testimonyProgress.length === 1 ? (
              <Button onClick={() => submit('approve')} variant="primary" size="m" className="bill-button-spacing float-end">
                Route for Office Review
              </Button>
            ) : ''}
            { testimony.testimonyProgress.length === 2 ? (
              <ButtonGroup className="float-end">
                <Button onClick={() => submit('reject')} variant="danger" size="m" className="bill-button-spacing float-end">
                  Send back to Testimony Writer
                </Button>
                <Button onClick={() => submit('approve')} variant="success" size="m" className="bill-button-spacing float-end">
                  Route to PIPE
                </Button>
              </ButtonGroup>
            ) : ''}
            { testimony.testimonyProgress.length === 3 ? (
              <ButtonGroup className="float-end">
                <Button onClick={() => submit('reject')} variant="danger" size="m" className="bill-button-spacing float-end">
                  Send back to Office for additional edits
                </Button>
                <Button onClick={() => submit('approve')} variant="warning" size="m" className="bill-button-spacing float-end">
                  Route to Final Approver
                </Button>
              </ButtonGroup>
            ) : ''}
            { testimony.testimonyProgress.length === 4 ? (
              <ButtonGroup className="float-end">
                <Button onClick={() => submit('reject')} variant="danger" size="m" className="bill-button-spacing float-end">
                  Send back to PIPE
                </Button>
                <Button onClick={() => submit('approve')} variant="primary" size="m" className="bill-button-spacing float-end">
                  Approve and Send to Office Secretary
                </Button>
              </ButtonGroup>
            ) : ''}
            { testimony.testimonyProgress.length === 5 ? (
              <Button onClick={finalConfirmation} variant="primary" size="m" className="bill-button-spacing float-end">
                Finalize Testimony
              </Button>
            ) : ''}
          </Col>
        </Row>

        <Testimony
          ref={componentRef}
          testimony={{ hearingDate: (testimony.hearingDate ? testimony.hearingDate.toLocaleDateString() : '-'),
            hearingTime: (testimony.hearingDate ? testimony.hearingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'),
            hearingLocation: (testimony.hearingLocation ? testimony.hearingLocation : '-'),
            committeeName: (testimony.committeeName ? testimony.committeeName : '-'),
            department: '-',
            testifier: (testimony.testifier ? testimony.testifier : '-'),
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
