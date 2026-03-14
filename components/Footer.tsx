import Image from "next/image";

export default function Footer() {
  return (
    <footer id="global-footer" className="bg-obsidian border-t border-gold-champagne/10 py-16 px-6 mt-12 bg-[url('/bg-noise.png')] opacity-95">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Image src="/logo.png" alt="Membership Barbershop Logo" width={150} height={50} className="mb-4 h-10 w-auto" />
          <h4 className="font-display text-2xl font-bold text-bone mb-4 uppercase italic tracking-tighter">Membership <span className="text-gold-champagne">Barbershop</span></h4>
          <p className="text-bone/50 text-sm">Precision Fast. Lounge-Level Luxury.</p>
        </div>
        <div>
          <h4 className="font-bold text-bone mb-4 uppercase tracking-wider text-sm">Platform</h4>
          <ul className="space-y-3 text-sm text-bone/60">
            <li><a href="/locations" className="hover:text-gold-champagne transition-colors">Locations</a></li>
            <li><a href="/membership" className="hover:text-gold-champagne transition-colors">Membership Barbershop</a></li>
            <li><a href="/services" className="hover:text-gold-champagne transition-colors">Services</a></li>
            <li><a href="/stylists" className="hover:text-gold-champagne transition-colors">Stylists</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-bone mb-4 uppercase tracking-wider text-sm">Account</h4>
          <ul className="space-y-3 text-sm text-bone/60">
            <li><a href="/account" className="hover:text-gold-champagne transition-colors">Dashboard</a></li>
            <li><a href="/book" className="hover:text-gold-champagne transition-colors">Book Now</a></li>
            <li><a href="/login" className="hover:text-gold-champagne transition-colors">Login / Register</a></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <p className="text-bone/30 text-xs mt-8 md:mt-0">© {new Date().getFullYear()} Membership Barbershop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
