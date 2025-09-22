import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  Navbar,
  PendingListComponent,
  PlanListComponent,
  ReportListComponent,
  SpinnerComponent,
  TargetComponent,
  ToastContainer,
} from "./components";
import { handleToastWarn } from "./constants/handleToast";
import { auth, db } from "./firebase.config";
import { UserModel } from "./models/UserModel";
import {
  AddReportScreen,
  AdminScreen,
  BankScreen,
  CalloverScreen,
  CartScreen,
  ChildrenScreen,
  ForgotPasswordScreen,
  LoginScreen,
  MediaScreen,
  PendingScreen,
  PlanScreen,
  ProfileScreen,
  RegisterScreen,
  ReportScreen,
  SettingScreen,
} from "./screens";
import useUserStore from "./zustand/useUserStore";

type AuthState = {
  user: User | null;
  isLoading: boolean;
};

export default function App() {
  const { setUser } = useUserStore();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setAuthState({ user: currentUser, isLoading: false });

      if (currentUser) {
        // chỉ fetch khi có user
        try {
          getDoc(doc(db, "users", currentUser.uid as string))
            .then(async (result) => {
              setUser({ ...result.data(), id: currentUser.uid } as UserModel);
            })
            .catch(async () => {
              await signOut(auth);
              handleToastWarn(
                "Tài khoản chưa được cấp quyền, vui lòng liên hệ admin !"
              );
            });
        } catch (error) {
          console.log("error: ", error);
        }
      } else {
        // clear user khi logout
        setUser(null);
      }
    });
    return () => unsub();
  }, [setUser]);

  if (authState.isLoading) {
    return <SpinnerComponent />;
  }

  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={
            authState.user ? <Navigate to="/" replace /> : <LoginScreen />
          }
        />
        <Route
          path="/"
          element={
            authState.user ? (
              <ChildrenScreen />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="home/:id" element={<Navbar />}>
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="bank" element={<BankScreen />} />
          <Route path="target" element={<TargetComponent />} />
          <Route path="plan" element={<PlanScreen />} />
          <Route path="planList" element={<PlanListComponent />} />
          <Route path="report" element={<ReportScreen />} />
          <Route path="reportList" element={<ReportListComponent />} />
          <Route path="addReport" element={<AddReportScreen />} />
          <Route path="pending" element={<PendingScreen />} />
          <Route path="pendingList" element={<PendingListComponent />} />
          <Route path="callover" element={<CalloverScreen />} />
          <Route path="media" element={<MediaScreen />} />
          <Route path="setting" element={<SettingScreen />} />
          <Route path="cart" element={<CartScreen />} />
          {/* <Route path="admin" element={<AdminScreen />} /> */}
          <Route
          path="admin"
          element={
            authState.user && ['52LPPcC0ejgAWSEoWhWBCT8KHsm2'].includes(authState.user.uid ) ? (
              <AdminScreen />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        </Route>
        <Route path="register" element={<RegisterScreen />} />
        <Route path="forgotPassword" element={<ForgotPasswordScreen />} />

        <Route path="*" element={<>404</>} />
      </Routes>

      <ToastContainer />
    </div>
  );
}
