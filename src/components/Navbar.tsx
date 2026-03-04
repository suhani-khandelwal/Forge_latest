import { Link, useLocation } from "react-router-dom";
import { FlaskConical } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isHero = location.pathname === "/";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHero ? "bg-transparent" : "bg-background/95 backdrop-blur border-b border-border shadow-sm"}`}>
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isHero ? "bg-white/20" : "bg-forest"}`}>
            <FlaskConical className={`w-4 h-4 ${isHero ? "text-white" : "text-primary-foreground"}`} />
          </div>
          <span className={`font-display font-bold text-xl tracking-wider ${isHero ? "text-white" : "text-forest"}`}>
            FORGE
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/upload"
            className={`text-sm font-medium transition-colors ${isHero ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-forest"}`}
          >
            Upload Data
          </Link>
          <Link
            to="/mine"
            className={`text-sm font-medium transition-colors ${isHero ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-forest"}`}
          >
            Mine Data
          </Link>
          <Link
            to="/"
            className={`text-sm font-body font-semibold px-4 py-2 rounded-lg transition-all ${isHero ? "bg-white text-forest hover:bg-white/90" : "bg-forest text-primary-foreground hover:bg-forest-light"}`}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
