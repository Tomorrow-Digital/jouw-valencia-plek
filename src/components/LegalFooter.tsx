import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/privacy-policy", label: "Privacybeleid" },
  { to: "/terms-of-service", label: "Algemene Voorwaarden" },
  { to: "/data-deletion", label: "Gegevens verwijderen" },
];

export function LegalFooter() {
  const { pathname } = useLocation();

  return (
    <footer className="border-t border-border bg-muted/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Casita Valencia</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((link) =>
            pathname === link.to ? (
              <span key={link.to} className="text-primary font-medium">
                {link.label}
              </span>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </footer>
  );
}
