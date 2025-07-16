"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface LearnButtonProps {
  href: string;
  title: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  className?: string;
}

export function LearnButton({ 
  href, 
  title, 
  variant = "default", 
  size = "default",
  showIcon = true,
  className = ""
}: LearnButtonProps) {
  return (
    <Button 
      asChild 
      variant={variant} 
      size={size}
      className={`${className}`}
    >
      <Link href={href}>
        {title}
        {showIcon && <ExternalLink className="w-4 h-4 ml-2" />}
      </Link>
    </Button>
  );
}
