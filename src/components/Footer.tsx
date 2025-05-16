
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Hostel Allotment System</h3>
            <p className="text-sm">
              A comprehensive platform for managing hostel allocations in an efficient and transparent manner.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-white">Apply for Hostel</Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-white">Rules & Regulations</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/rules" className="hover:text-white">Hostel Rules</Link>
              </li>
              <li>
                <a href="#" className="hover:text-white">FAQs</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Mess Menu</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Campus Map</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <address className="not-italic text-sm space-y-2">
              <p>University Hostel Administration</p>
              <p>University Campus</p>
              <p>Email: hostel@university.edu</p>
              <p>Phone: +1 234 567 8900</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center">
          <p>&copy; {currentYear} Hostel Allotment System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
