import { Button } from "@/components/ui/button";
import React from "react";
import { Routes, Route } from "react-router";
import { logout } from "@/features/auth/auth-slice";
import { useDispatch } from "react-redux";

function AppRouter() {
  const dispatch = useDispatch();
  return (
    <>
      <Routes>
        <Route path="/" element={<p>App</p>} />
      </Routes>
      <Button
        onClick={() => dispatch(logout())}
        type="submit"
        className="w-[100px]"
      >
        Logout
      </Button>
    </>
  );
}

export default AppRouter;
