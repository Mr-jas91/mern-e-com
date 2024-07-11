import AdminApp from "./Admin/Admin";
import MainApp from "./User/components/MainApp";

function App() {
  const isAdmin = window.location.hostname === "admin.localhost";

  return isAdmin ? <AdminApp /> : <MainApp />;
}

export default App;
