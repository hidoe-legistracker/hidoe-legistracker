import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { useReactToPrint } from 'react-to-print';
import { Badge, Breadcrumb, Button, ButtonGroup, Col, Container, Row, Toast } from 'react-bootstrap';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import Swal from 'sweetalert2';
import { Testimony } from '../components/Testimony';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Testimonies } from '../../api/testimony/TestimonyCollection';
import { Measures } from '../../api/measure/MeasureCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

const TestimonyPage = () => {

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { measureID, testimonyID } = useParams();
  const { measure, testimony, user, ready } = useTracker(() => {
    const testimonySubscription = Testimonies.subscribeTestimony();
    const measureSubscription = Measures.subscribeMeasures();
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = measureSubscription.ready() && testimonySubscription.ready() && userSubscription.ready() && adminSubscription.ready(); const testimonyDoc = Testimonies.findOne({ _id: testimonyID });
    const measureDoc = Measures.findOne({ _id: measureID });

    const username = Meteor.user() ? Meteor.user().username : '';

    let usr = UserProfiles.findOne({ email: username });
    if (usr === undefined) {
      usr = AdminProfiles.findOne({ email: username });
    }
    return {
      measure: measureDoc,
      testimony: testimonyDoc,
      user: usr,
      ready: rdy,
    };
  }, [measureID, testimonyID]);

  const addComment = (type, value) => {
    if (type === 'approve') {
      testimony.testimonyProgress.push(0);
    }
    if (type === 'reject') {
      testimony.testimonyProgress.pop();
    }
    testimony.reviewerComments.push({
      comment: value,
      writer: user.email,
      writerPosition: user.position,
      submissionOption: type,
    });
    const testimonyProgress = testimony.testimonyProgress;
    const reviewerComments = testimony.reviewerComments;

    // console.log(testimonyProgress);
    const collectionName = Testimonies.getCollectionName();
    const updateData = { id: testimonyID, testimonyProgress, reviewerComments };
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

  const writeComment = (type) => {
    Swal.fire({
      title: 'Add a comment',
      text: 'comment:',
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: 'green',
    }).then((result) => {
      if (result.value) {
        addComment(type, result.value);
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
        addComment('approve', 'Finalized');
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
            { testimony.testimonyProgress.length === 1 && user.position === 'Testimony Writer' ? (
              <ButtonGroup className="float-end">
                <Button href={`/edit-testimony/${measureID}&${testimonyID}`} variant="secondary" size="m" className="bill-button-spacing">
                  Edit
                </Button>
                <Button onClick={() => writeComment('approve')} variant="primary" size="m" className="bill-button-spacing float-end">
                  Route for Office Review
                </Button>
              </ButtonGroup>
            ) : ''}
            { testimony.testimonyProgress.length === 2 && user.position === 'Office Approver' ? (

              <ButtonGroup className="float-end">
                <Button href={`/edit-testimony/${measureID}&${testimonyID}`} variant="secondary" size="m" className="bill-button-spacing">
                  Edit
                </Button>
                <Button onClick={() => writeComment('reject')} variant="danger" size="m" className="bill-button-spacing float-end">
                  Send back to Testimony Writer
                </Button>
                <Button onClick={() => writeComment('approve')} variant="success" size="m" className="bill-button-spacing float-end">
                  Route to PIPE
                </Button>
              </ButtonGroup>
            ) : ''}
            { testimony.testimonyProgress.length === 3 && user.position === 'PIPE' ? (
              <ButtonGroup className="float-end">
                <Button href={`/edit-testimony/${measureID}&${testimonyID}`} variant="secondary" size="m" className="bill-button-spacing">
                  Edit
                </Button>
                <Button onClick={() => writeComment('reject')} variant="danger" size="m" className="bill-button-spacing float-end">
                  Send back to Office for additional edits
                </Button>
                <Button onClick={() => writeComment('approve')} variant="warning" size="m" className="bill-button-spacing float-end">
                  Route to Final Approver
                </Button>
              </ButtonGroup>
            ) : ''}
            { testimony.testimonyProgress.length === 4 && user.position === 'Final Approver' ? (
              <ButtonGroup className="float-end">
                <Button href={`/edit-testimony/${measureID}&${testimonyID}`} variant="secondary" size="m" className="bill-button-spacing">
                  Edit
                </Button>
                <Button onClick={() => writeComment('reject')} variant="danger" size="m" className="bill-button-spacing float-end">
                  Send back to PIPE
                </Button>
                <Button onClick={() => writeComment('approve')} variant="primary" size="m" className="bill-button-spacing float-end">
                  Approve and Send to Office Secretary
                </Button>
              </ButtonGroup>
            ) : ''}
            { testimony.testimonyProgress.length === 5 && user.position === 'Office Secretary' ? (
              <ButtonGroup className="float-end">
                <Button href={`/edit-testimony/${measureID}&${testimonyID}`} variant="secondary" size="m" className="bill-button-spacing">
                  Edit
                </Button>
                <Button onClick={finalConfirmation} variant="primary" size="m" className="bill-button-spacing float-end">
                  Finalize Testimony
                </Button>
              </ButtonGroup>
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
      <Container>
        {testimony.reviewerComments.map((obj) => (
          <Toast className="mb-3">
            {obj.submissionOption === 'approve' ? (
              <Toast.Header>
                <strong className="me-auto">{obj.writer}</strong>
                <Badge bg="primary" className="me-auto">{obj.writerPosition}</Badge>
                <Badge bg="success">Approved</Badge>
              </Toast.Header>
            ) : ''}
            {obj.submissionOption === 'reject' ? (
              <Toast.Header>
                <strong className="me-auto">{obj.writer}</strong>
                <Badge bg="primary" className="me-auto">{obj.writerPosition}</Badge>
                <Badge bg="danger">Rejected</Badge>
              </Toast.Header>
            ) : ''}
            <Toast.Body>{obj.comment}</Toast.Body>
          </Toast>
        ))}
      </Container>
    </div>
  ) : <LoadingSpinner message="Loading Testimony" />;
};

export default TestimonyPage;
