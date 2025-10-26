const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-8">
      <div className="container px-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Hayat Foods India PVT. LTD</h3>
          <p className="text-sm opacity-80 mb-4">
            Premium Bakery Products | Kannur, Kerala, India
          </p>
          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} Hayat Foods India PVT. LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
