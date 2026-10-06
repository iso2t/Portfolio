const links = [
  ["GitHub", "https://github.com/iso2t/"],
  ["Discord", "https://discord.gg/iso2t"],
  ["Twitter", "https://twitter.com/iso2t_"],
  ["YouTube", "https://www.youtube.com/@iso2t"],
  ["DEV", "https://dev.to/iso2t"],
  ["Substack", "https://iso2t.substack.com/"],
];

export function FooterLinks() {
  return (
    <span className="footer-links">
      <span role="navigation" aria-label="Social links">
        {links.map(([name, href]) => (
          <a key={name} href={href} target="_blank" rel="noopener noreferrer">
            {name}
          </a>
        ))}
      </span>
      <span className="footer-copyright">© {new Date().getFullYear()} ISO2T. All rights reserved.</span>
    </span>
  );
}
