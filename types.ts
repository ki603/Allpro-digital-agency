import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Step {
  number: number;
  title: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}