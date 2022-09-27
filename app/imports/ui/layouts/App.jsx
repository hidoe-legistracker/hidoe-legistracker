import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import Directory from '../pages/Directory';
import AddMeasure from '../pages/AddMeasure';
import MyFolders from '../pages/MyFolders';
import Inbox from '../pages/Inbox';
import CreateEmail from '../pages/CreateEmail';
import NotFound from '../pages/NotFound';
import SignOut from '../pages/SignOut';
import NavBar from '../components/NavBar';
import ViewBill from '../pages/ViewBill';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';
import NotAuthorized from '../pages/NotAuthorized';
import { ROLE } from '../../api/role/Role';
import ChangePasswordAdmin from '../pages/ChangePasswordAdmin';
import ChangePasswordUser from '../pages/ChangePasswordUser';
import MonitoringReport from '../pages/MonitoringReport';
import AddTestimony from '../pages/AddTestimony';
import TestimonyPage from '../pages/TestimonyPage';
import EditTestimony from '../pages/EditTestimony';
import EmployeeList from '../pages/EmployeeList';
import ForgotPassword from '../pages/ForgotPassword';
import EditProfile from '../pages/EditProfile';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => {
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <Routes>
          {currentUser ? (
            <Route exact path="/" element={<Directory />} />
          ) : <Route exact path="/" element={<SignIn />} />}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<AdminProtectedRoute><SignUp /></AdminProtectedRoute>} />
          <Route path="/employees" element={<AdminProtectedRoute><EmployeeList /></AdminProtectedRoute>} />
          <Route path="/change-password-admin" element={<AdminProtectedRoute><ChangePasswordAdmin /></AdminProtectedRoute>} />
          <Route path="/change-password-user" element={<ProtectedRoute><ChangePasswordUser /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/profile/:_id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit-profile/:_id" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
          <Route path="/create-email" element={<ProtectedRoute><CreateEmail /></ProtectedRoute>} />
          <Route path="/create-measure" element={<ProtectedRoute><AddMeasure /></ProtectedRoute>} />
          <Route path="/create-testimony" element={<ProtectedRoute><AddTestimony /></ProtectedRoute>} />
          <Route path="/monitoringreport" element={<ProtectedRoute><MonitoringReport /></ProtectedRoute>} />
          <Route path="/edit-testimony" element={<ProtectedRoute><EditTestimony /></ProtectedRoute>} />
          <Route path="/myfolders" element={<ProtectedRoute><MyFolders /></ProtectedRoute>} />
          <Route path="/view-bill" element={<ProtectedRoute><ViewBill /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
          <Route path="/view-testimony/:_id" element={<ProtectedRoute><TestimonyPage /></ProtectedRoute>} />
          <Route path="/notauthorized" element={<NotAuthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};
/*
 * ProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  // console.log('ProtectedRoute', isLogged);
  return isLogged ? children : <Navigate to="/signin" />;
};

/**
 * AdminProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);
  console.log('AdminProtectedRoute', isLogged, isAdmin);
  return (isLogged && isAdmin) ? children : <Navigate to="/notauthorized" />;
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProtectedRoute.defaultProps = {
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdminProtectedRoute.defaultProps = {
  children: <Landing />,
};

export default App;
