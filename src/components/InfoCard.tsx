
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  icon: LucideIcon;
  className?: string;
  onClick?: () => void;
}

const InfoCard = ({ title, icon: Icon, className, onClick }: InfoCardProps) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer animate-fade-in",
        className
      )}
      onClick={onClick}
    >
      <div className="p-3 rounded-full bg-hostel-light text-hostel-primary mb-3">
        <Icon size={24} />
      </div>
      <h3 className="text-hostel-dark font-medium text-sm text-center">{title}</h3>
    </div>
  );
};

export default InfoCard;
