import './index.css';

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./project/layout/layout"; // adjust path if needed
import Home from "./project/pages/home";
import PlanTrip from "./project/pages/planTrip";
import MyTrips from "./project/pages/myTrips";  
import Profile from "./project/pages/profile";
import ItineraryView from "./project/pages/itineraryView";

function App() {
    return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home/>} />
          <Route path="/plantrip" element={<PlanTrip />} /> 
          <Route path="/mytrips" element={<MyTrips />} />
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/ItineraryView" element={<ItineraryView />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;


//export default function App() {
//   return (
//     <BrowserRouter>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Navigate to="/home" replace />} />
//           <Route path="/home" element={<Home/>} />

//         </Routes>
//       </Layout>
//     </BrowserRouter>
//   );
// }