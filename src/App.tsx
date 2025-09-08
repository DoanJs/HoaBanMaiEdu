import { Route, Routes } from "react-router-dom";
import {
  Children,
  Navbar,
  ReportListComponent,
  TargetComponent
} from "./components";
import {
  AddReportScreen,
  BankScreen,
  CalloverScreen,
  CartScreen,
  LoginScreen,
  MediaScreen,
  PlanScreen,
  RegisterScreen,
  ReportScreen,
  SettingScreen,
} from "./screens";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Children />} />
        <Route path="home" element={<Navbar />}>
          <Route path="bank" element={<BankScreen />} />
          <Route path="target" element={<TargetComponent />} />
          <Route path="plan" element={<PlanScreen />} />
          <Route path="report" element={<ReportScreen />} />
          <Route path="reportList" element={<ReportListComponent />} />
          <Route path="addReport" element={<AddReportScreen />} />
          <Route path="callover" element={<CalloverScreen />} />
          <Route path="media" element={<MediaScreen />} />
          <Route path="setting" element={<SettingScreen />} />
          <Route path="cart" element={<CartScreen />} />
        </Route>
        <Route path="login" element={<LoginScreen />} />
        <Route path="register" element={<RegisterScreen />} />

        <Route path="*" element={<>404</>} />
      </Routes>
    </div>
  );
}
