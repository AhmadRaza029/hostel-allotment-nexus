
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  
  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Link to="/home" className="text-xl font-bold text-hostel-primary">
            Hostel Allotment System
          </Link>
        </div>
        
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Link to="/rules" className="text-sm font-medium hover:text-hostel-primary">
                Rules
              </Link>
            </li>
            <li>
              <Link to="/home" className="text-sm font-medium hover:text-hostel-primary">
                About
              </Link>
            </li>
            
            {user ? (
              <>
                <li>
                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="text-sm font-medium hover:text-hostel-primary">
                    {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                </li>
                
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Account
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isAdmin ? (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer">Admin Dashboard</Link>
                        </DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/apply" className="cursor-pointer">Apply for Hostel</Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Button asChild variant="outline" size="sm" className="mr-2">
                    <Link to="/">Student Login</Link>
                  </Button>
                </li>
                <li>
                  <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600">
                    <Link to="/admin-login">Admin Login</Link>
                  </Button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
