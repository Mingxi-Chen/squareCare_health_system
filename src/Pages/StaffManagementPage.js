/*css stylesheet*/
import "../components/StaffManagementPage/StaffManagementPage.css"
import StaffInfo from "../components/StaffManagementPage/StaffInfo";
import ResponPatients from "../components/StaffManagementPage/ResponPatients";
import ST_Scheduler from "../components/StaffManagementPage/ST-Roster";
import Sidebar from "../components/SideBar";
import React, { useState } from "react";

function StaffManagementPage() {
    const [open, setOpen] = useState(false);
    return (
        <main style={{ display: "flex",overflow: "hidden" }}>
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
        <section className="background" style={{ flexGrow: 1, minWidth: '300px'}}>
            <div className="whole-screen inline-flex block">
                <div className="col-s-11 col-5">
                    <StaffInfo></StaffInfo>
                </div >
                <div className="ST-Scheduler col-s-11 col-7">
                    <h1 className="StaffInfo-ButtonContainer-Btn">Roster</h1>
                    <ST_Scheduler></ST_Scheduler>
                </div>
            </div>
        </section>
        </main>
    )
}

export default StaffManagementPage