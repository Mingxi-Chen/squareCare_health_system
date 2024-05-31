import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/context";

import Login from "./Login/Login";
import Process from "./Process/Process";
import PatientInfo from "./PatientInfo/PatientInfo";

import Patients from "./Pages/Patients";
import Staffs from "./components/StaffManagement";
import MessagePage from "./Pages/Messages";

import AccountManagement from "./Pages/Account";
import Notification from "./components/Notification";
import Resources from "./components/Resources";

import DashboardPage from './Pages/DashboardPage';
import StaffManagementPage from './Pages/StaffManagementPage';
import ForgetPassword from "./Pages/ForgetPassword";

function App() {
  return (
    // <div className="App">
    //   <PatientInfo/>
    // </div>
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/patientInfo/:patientId" element = {<PatientInfo/>} />
        <Route path="/process/:patientId" element={<Process />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/staffs" element={<Staffs />} />
        <Route path="/messages" element={<MessagePage />} />
        <Route path="/AccountManagement" element={<AccountManagement/>} />
        <Route path="/Notification" element={<Notification />} />
        <Route path="/Resources" element={<Resources/>} />
        <Route path='/DashBoard' element={<DashboardPage/>} />
        <Route path='/StaffManagementPage' element={<StaffManagementPage/>} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
