import { Routes, Route } from "react-router";

import { HomePage } from "./pages/HomePage";

import { AppHeader } from "./cmps/AppHeader";
import { AppFooter } from "./cmps/AppFooter";
import { UserMsg } from "./cmps/UserMsg.jsx";

export function RootCmp() {
  return (
    <div className="main-container">
      <AppHeader />
      <UserMsg />
      <main>
        <Routes>
          <Route path="" element={<HomePage />} />
        </Routes>
      </main>
      <AppFooter />
    </div>
  );
}
