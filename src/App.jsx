import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import AuthRouter from "./router/auth-router";
import AppRouter from "./router/app-router";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "@/features/auth/auth-slice";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  return (
    <>
      {/* {isAuthenticated ? "true" : "false"} */}
      <Routes>
        {isAuthenticated ? (
          <Route path="/*" element={<AppRouter />} />
        ) : (
          <Route path="/*" element={<AuthRouter />} />
        )}
      </Routes>

      {/* <button className="mx-3" onClick={() => dispatch(login())}>
        Login
      </button>
      <button onClick={() => dispatch(logout())}>Logout</button> */}
    </>
  );
}

export default App;
