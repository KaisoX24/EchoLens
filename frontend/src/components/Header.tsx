import { CheckCircle } from "lucide-react";

function Header() {
  return (
    <header className="header">
      <div>
        <h1>EchoLens</h1>
        <p>AI Accessibility Assistant</p>
      </div>

      <div className="api-status">
        <CheckCircle size={16} />
        Connected to API
      </div>
    </header>
  );
}

export default Header;