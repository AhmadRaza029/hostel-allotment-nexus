
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full bg-white/90 backdrop-blur-sm py-4 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <Home className="h-6 w-6 text-hostel-primary mr-2" />
          <span className="font-bold text-hostel-dark text-lg">Hostel Allotment</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-hostel-dark hover:text-hostel-primary">Home</Button>
          <Button variant="ghost" className="text-hostel-dark hover:text-hostel-primary">About</Button>
          <Button variant="ghost" className="text-hostel-dark hover:text-hostel-primary">Contact</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
