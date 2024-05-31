import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import Patients from "../components/Patients/Patients";

const PatientsPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <main style={{ display: "flex" }}>
      <div
        style={{
          width: open ? 240 : 100,
          transition: "width 0.3s ease-in-out",
          backgroundColor: "#FAFBFF",
        }}
        className="drawer-wrapper"
      >
        <Sidebar open={open} setOpen={setOpen} />
      </div>
      <section className="main-section">
        <Patients />
      </section>
    </main>
  );
};

export default PatientsPage;
