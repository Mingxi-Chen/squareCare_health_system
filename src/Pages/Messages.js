import { useState, useContext, useEffect } from "react";
import MessagePanel from "../components/MessagePanel";
import SideBar from "../components/SideBar";
import { UserContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import { LS_AUTH_KEY } from "../context/config";

export default function MessagePage() {
  const [open, setOpen] = useState(false);
  const { user, setUser, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email && !loading) {
      navigate("/");
      localStorage.removeItem(LS_AUTH_KEY);
      setUser({});
    }
  }, [user, navigate, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main style={{ display: "flex" }}>
      <div
        style={{
          width: open ? 240 : 100,
        }}
        className="drawer-wrapper"
      >
        <SideBar open={open} setOpen={setOpen} />
      </div>
      <section className="main-section bg-gray">
        <MessagePanel />
      </section>
    </main>
  );
}
