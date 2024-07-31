import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageAccueil } from "layout/dashboard/PageAccueil";
import { Apropos } from "layout/dashboard/Apropos";
import PaymentPage from "layout/dashboard/Paiement";
import Contact from "layout/dashboard/Contact";
import EmailFormPage from "layout/dashboard/EmailFormPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageAccueil />} />
        <Route path="/Apropos" element={<Apropos />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/PaymentPage" element={<PaymentPage />} />
        <Route path="/EmailFormPage/:amount" element={<EmailFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}
