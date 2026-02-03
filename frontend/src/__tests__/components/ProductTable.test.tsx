import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductTable } from '../../components/ProductTable';
import { mockProducts, mockCalculatedPrices } from '../mockData';

describe('ProductTable Component', () => {
  const defaultProps = {
    products: mockProducts,
    selectedProductIds: [],
    onSelectionChange: vi.fn(),
    calculatedPrices: undefined,
  };

  it('should render all products', () => {
    render(<ProductTable {...defaultProps} />);
    
    expect(screen.getByText('High Garden Pinot Noir 2021')).toBeInTheDocument();
    expect(screen.getByText('Koyama Methode Brut Nature NV')).toBeInTheDocument();
    expect(screen.getByText('Koyama Riesling 2018')).toBeInTheDocument();
  });

  it('should display product details', () => {
    render(<ProductTable {...defaultProps} />);
    
    expect(screen.getByText('HGVPIN216')).toBeInTheDocument();
    expect(screen.getByText('High Garden')).toBeInTheDocument();
    expect(screen.getByText('$279.06')).toBeInTheDocument();
  });

  it('should show empty state when no products', () => {
    render(<ProductTable {...defaultProps} products={[]} />);
    
    expect(screen.getByText(/No products found/)).toBeInTheDocument();
  });

  it('should call onSelectionChange when product checkbox clicked', () => {
    const onSelectionChange = vi.fn();
    render(<ProductTable {...defaultProps} onSelectionChange={onSelectionChange} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // First checkbox is select all
    
    expect(onSelectionChange).toHaveBeenCalled();
  });

  it('should select all products when header checkbox clicked', () => {
    const onSelectionChange = vi.fn();
    render(<ProductTable {...defaultProps} onSelectionChange={onSelectionChange} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Header checkbox
    
    expect(onSelectionChange).toHaveBeenCalledWith(['1', '2', '3']);
  });

  it('should deselect all when header checkbox clicked and all selected', () => {
    const onSelectionChange = vi.fn();
    render(
      <ProductTable 
        {...defaultProps} 
        selectedProductIds={['1', '2', '3']}
        onSelectionChange={onSelectionChange} 
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    
    expect(onSelectionChange).toHaveBeenCalledWith([]);
  });

  it('should highlight selected rows', () => {
    const { container } = render(
      <ProductTable {...defaultProps} selectedProductIds={['1']} />
    );
    
    const selectedRow = container.querySelector('.bg-blue-50');
    expect(selectedRow).toBeInTheDocument();
  });

  it('should display calculated prices when provided', () => {
    render(
      <ProductTable 
        {...defaultProps} 
        calculatedPrices={mockCalculatedPrices}
      />
    );
    
    expect(screen.getByText('New Price')).toBeInTheDocument();
    expect(screen.getByText('$299.06')).toBeInTheDocument();
    expect(screen.getByText('$140.00')).toBeInTheDocument();
  });

  it('should display adjustment column when calculated prices provided', () => {
    render(
      <ProductTable 
        {...defaultProps} 
        calculatedPrices={mockCalculatedPrices}
      />
    );
    
    expect(screen.getByText('Adjustment')).toBeInTheDocument();
  });

  it('should show selection count', () => {
    render(
      <ProductTable {...defaultProps} selectedProductIds={['1', '2']} />
    );
    
    expect(screen.getByText(/2 of 3 product\(s\) selected/)).toBeInTheDocument();
  });
});