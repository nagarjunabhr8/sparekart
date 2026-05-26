import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-app py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="font-bold">S</span>
              </div>
              <span className="font-bold text-lg">SpareKart</span>
            </div>
            <p className="text-neutral-400 text-sm mb-4">
              Genuine spare parts for Indian automobiles, trusted by professionals.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <a href="tel:+919876543210" className="hover:text-primary">
                  +91 9876543210
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <a href="mailto:support@sparekart.com" className="hover:text-primary">
                  support@sparekart.com
                </a>
              </div>
            </div>
          </div>

          {/* B2C Links */}
          <div>
            <h4 className="font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/b2c" className="text-neutral-400 hover:text-primary">
                  Shop Now
                </Link>
              </li>
              <li>
                <Link href="/b2c/products" className="text-neutral-400 hover:text-primary">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link href="/b2c/orders" className="text-neutral-400 hover:text-primary">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link href="/b2c/support" className="text-neutral-400 hover:text-primary">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* B2B Links */}
          <div>
            <h4 className="font-semibold mb-4">For Businesses</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/b2b" className="text-neutral-400 hover:text-primary">
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/b2b/catalog" className="text-neutral-400 hover:text-primary">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/b2b/account" className="text-neutral-400 hover:text-primary">
                  Account
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="text-neutral-400 hover:text-primary">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="text-neutral-400 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="text-neutral-400 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="text-neutral-400 hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
            <div className="flex gap-4">
              <Facebook size={20} className="text-neutral-400 hover:text-primary cursor-pointer" />
              <Twitter size={20} className="text-neutral-400 hover:text-primary cursor-pointer" />
              <Instagram size={20} className="text-neutral-400 hover:text-primary cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © 2024 SpareKart. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0 text-sm">
              <Link href="/" className="text-neutral-400 hover:text-primary">
                Authenticity Guarantee
              </Link>
              <Link href="/" className="text-neutral-400 hover:text-primary">
                Warranty Info
              </Link>
              <Link href="/" className="text-neutral-400 hover:text-primary">
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
