import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Home from "./home";

export default function App() {
  return (
    <Authenticator>{({ signOut }) => <Home signOut={signOut} />}</Authenticator>
  );
}
