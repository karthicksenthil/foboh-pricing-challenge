import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../../components/Header';

describe('Header Component', () => {
  it('should render the header with title', () => {
    render(<Header />);
    
    expect(screen.getByText('FOBOH Pricing')).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    render(<Header />);
    
    expect(screen.getByText('Create custom pricing profiles for your customers')).toBeInTheDocument();
  });

  it('should render API Docs link', () => {
    render(<Header />);
    
    const link = screen.getByText('API Docs');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'http://localhost:3001/api-docs');
    expect(link).toHaveAttribute('target', '_blank');
  });
});