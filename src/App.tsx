import { Route, Routes } from "react-router-dom";
import {
  Children,
  Navbar,
  ReportItemComponent,
  TargetComponent,
} from "./components";
import {
  AddReportScreen,
  BankScreen,
  CartScreen,
  MediaScreen,
  PlanScreen,
  ReportScreen,
  SettingScreen,
} from "./screens";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Children />} />
        <Route path="/home" element={<Navbar />}>
          <Route path="bank" element={<BankScreen />} />
          <Route path="target" element={<TargetComponent />} />
          <Route path="plan" element={<PlanScreen />} />
          <Route path="report" element={<ReportScreen />} />
          <Route path="reportItem" element={<ReportItemComponent />} />
          <Route path="addReport" element={<AddReportScreen />} />
          <Route path="media" element={<MediaScreen />} />
          <Route path="setting" element={<SettingScreen />} />
          <Route path="cart" element={<CartScreen />} />
        </Route>

        <Route path="*" element={<>404</>} />
      </Routes>
    </div>
  );
}
