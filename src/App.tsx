import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { SpinnerComponent, ToastContainer } from "./components";
import { handleToastWarn } from "./constants/handleToast";
import { ADMINID } from "./constants/info";
import { auth, db } from "./firebase.config";
import { UserModel } from "./models";
import AdminScreen from "./screens/admin/AdminScreen";
import ForgotPasswordBootstrapGreen from "./screens/auth/ForgotPasswordScreen";
import LoginBootstrapGreen from "./screens/auth/LoginScreen";
import RegisterBootstrapGreen from "./screens/auth/RegisterScreen";
import GoalBankBootstrapGreen from "./screens/bank/Bank";
import GoalCartBootstrapGreen from "./screens/cart/Cart";
import HomeStudentsBootstrapGreen from "./screens/children/ChildrenScreen";
import ChangePassword from "./screens/dashboard/ChangePassword";
import DashboardBootstrapGreen from "./screens/dashboard/DashBoard";
import PendingApprovalBootstrapGreen from "./screens/pending/Pendings";
import PlanDetailBootstrapGreen from "./screens/plan/PlanDetails";
import ApprovedPlansBootstrapGreen from "./screens/plan/Plans";
import AddReportBootstrapGreen from "./screens/report/AddReport";
import ReportDetailBootstrapGreen from "./screens/report/ReportDetails";
import ApprovedReportBootstrapGreen from "./screens/report/Reports";
import ScrollButtons from "./screens/scroll/ScrollButtons";
import { useUserStore } from "./zustand";
import SplashScreen from "./screens/splash/SplashScreen";

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


const [progress, setProgress] = useState(10);
/**
   * Progress giả khi Firebase Auth đang kiểm tra
   */
  useEffect(() => {
    if (!authState.isLoading) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 8;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [authState.isLoading]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setProgress(95);

      setAuthState({
        user: currentUser,
        isLoading: false,
      });

      if (currentUser) {
        try {
          getDoc(doc(db, "users", currentUser.uid))
            .then((result) => {
              setUser({
                ...result.data(),
                id: currentUser.uid,
              } as UserModel);

              setProgress(100);
            })
            .catch(async () => {
              await signOut(auth);

              handleToastWarn(
                "Tài khoản chưa được cấp quyền, vui lòng liên hệ admin!"
              );
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        setUser(null);
        setProgress(100);
      }
    });

    return () => unsub();
  }, [setUser]);


  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (currentUser) => {
  //     setAuthState({ user: currentUser, isLoading: false });



  //     if (currentUser) {
  //       // chỉ fetch khi có user
  //       try {
  //         getDoc(doc(db, "users", currentUser.uid as string))
  //           .then(async (result) => {
  //             setUser({ ...result.data(), id: currentUser.uid } as UserModel);
  //           })
  //           .catch(async () => {
  //             await signOut(auth);
  //             handleToastWarn(
  //               "Tài khoản chưa được cấp quyền, vui lòng liên hệ admin !",
  //             );
  //           });
  //       } catch (error) {
  //         console.log("error: ", error);
  //       }
  //     } else {
  //       // clear user khi logout
  //       setUser(null);
  //     }
  //   });
  //   return () => unsub();
  // }, [setUser]);


  if (authState.isLoading) {
    return (
      <SplashScreen
        progress={Math.round(progress)}
        centerName="TRUNG TÂM CAN THIỆP SỚM HOA BAN MAI"
      />
    );
  }

  return (
    <div>
      <ScrollButtons />

      <Routes>
        <Route
          path="/login"
          element={
            authState.user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginBootstrapGreen />
            )
          }
        />
        <Route
          path="/"
          element={
            authState.user ? (
              <HomeStudentsBootstrapGreen />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="home/:id" element={<DashboardBootstrapGreen />}>
          {/* <Route path="general" element={<GeneralBootstrapGreen />} />
          <Route
            path="child-profile"
            element={<ChildProfileBootstrapGreen />}
          /> */}
          <Route path="bank" element={<GoalBankBootstrapGreen />} />
          <Route path="plan" element={<ApprovedPlansBootstrapGreen />} />
          <Route path="plandetail" element={<PlanDetailBootstrapGreen />} />
          <Route path="report" element={<ApprovedReportBootstrapGreen />} />
          <Route path="reportdetail" element={<ReportDetailBootstrapGreen />} />
          <Route path="addreport" element={<AddReportBootstrapGreen />} />
          <Route path="pending" element={<PendingApprovalBootstrapGreen />} />
          {/* <Route path="media" element={<MediaLibraryBootstrapGreen />} /> */}
          <Route path="cart" element={<GoalCartBootstrapGreen />} />
          {/* <Route path="setting" element={<Setting />} /> */}
          <Route path="changepassword" element={<ChangePassword />} />
          <Route
            path="admin"
            element={
              authState.user && [ADMINID].includes(authState.user.uid) ? (
                <AdminScreen />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Route>
        <Route
          path="register"
          element={
            authState.user && [ADMINID].includes(authState.user.uid) ? (
              <RegisterBootstrapGreen />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="forgotPassword"
          element={<ForgotPasswordBootstrapGreen />}
        />

        <Route path="*" element={<>404</>} />
      </Routes>

      <ToastContainer />
    </div>
  );
}
