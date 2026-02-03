import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsPanel } from '../../components/StatsPanel';

describe('StatsPanel Component', () => {
  it('should render all stat labels', () => {
    render(<StatsPanel totalProducts={10} selectedProducts={5} calculatedPrices={3} />);
    
    expect(screen.getByText('Total Products')).toBeInTheDocument();
    expect(screen.getByText('Selected Products')).toBeInTheDocument();
    expect(screen.getByText('Calculated Prices')).toBeInTheDocument();
  });

  it('should display correct values', () => {
    render(<StatsPanel totalProducts={10} selectedProducts={5} calculatedPrices={3} />);
    
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should display zero values', () => {
    render(<StatsPanel totalProducts={0} selectedProducts={0} calculatedPrices={0} />);
    
    const zeroValues = screen.getAllByText('0');
    expect(zeroValues).toHaveLength(3);
  });

  it('should render with correct styling classes', () => {
    const { container } = render(
      <StatsPanel totalProducts={10} selectedProducts={5} calculatedPrices={3} />
    );
    
    const statValues = container.querySelectorAll('.text-2xl');
    expect(statValues).toHaveLength(3);
  });
});