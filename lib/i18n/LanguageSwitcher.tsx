/**
 * Velithra - Language Switcher Component
 * Toggle between EN / AZ
 */

'use client';

import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useTranslation } from './useTranslation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 text-[10px] font-bold uppercase bg-primary text-primary-foreground rounded-sm px-1">
            {language}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className={language === 'en' ? 'bg-accent' : ''}
        >
          🇬🇧 English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('az')}
          className={language === 'az' ? 'bg-accent' : ''}
        >
          🇦🇿 Azərbaycan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
