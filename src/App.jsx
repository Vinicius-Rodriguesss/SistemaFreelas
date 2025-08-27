import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupServiceProvider from "./components/Signup/ServiceProvider";
import { LoginApp } from "./Pages/Login";
import { SignupContractorApp } from "./Pages/SignupContractor";
import './Pages/GlobalAuthStyles/index.css';

const App = () => {
  return (
    <Router>
      <div className='bodyPageAuth'>
        <div className="zoneAuthetication">
          <Routes>
            <Route path="/" element={<LoginApp />} />
            <Route path="/signup-contractor" element={<SignupContractorApp />} />
            <Route path="/signup-service-provider" element={<SignupServiceProvider />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
