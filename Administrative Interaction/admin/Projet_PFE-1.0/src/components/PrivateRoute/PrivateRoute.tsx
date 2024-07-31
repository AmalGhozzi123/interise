import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const auth = localStorage.getItem("accessToken");

  // Vérifiez si l'utilisateur est authentifié
  if (!auth) {
    return <Navigate to="/" replace />;
  }

  // Si authentifié, affichez le contenu protégé
  return children;
};

export default PrivateRoute;
