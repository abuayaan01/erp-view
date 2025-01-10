import { Button } from "@/components/ui/button";
import React from "react";
import { Routes, Route } from "react-router";
import { logout } from "@/features/auth/auth-slice";
import { useDispatch } from "react-redux";
import Sidebar from "@/app/dashboard/page";

function AppRouter() {
  const dispatch = useDispatch();
  return (
    <>
      <Sidebar>
        <Routes>
          <Route
            path="/"
            element={
              <div className="gap-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  <div className="aspect-video rounded-xl bg-muted/50" />
                  <div className="aspect-video rounded-xl bg-muted/50" />
                  <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 mt-4 md:min-h-[50vh]" />
              </div>
            }
          />
        </Routes>
      </Sidebar>
    </>
  );
}

export default AppRouter;
