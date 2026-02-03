import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionButtons } from '../../components/ActionButtons';

describe('ActionButtons Component', () => {
  const defaultProps = {
    onCalculate: vi.fn(),
    onSave: vi.fn(),
    loading: false,
    selectedCount: 2,
    showSaveSection: false,
    profileName: '',
    onProfileNameChange: vi.fn(),
  };

  it('should render calculate button', () => {
    render(<ActionButtons {...defaultProps} />);
    
    expect(screen.getByText('Calculate Prices')).toBeInTheDocument();
  });

  it('should disable calculate button when no products selected', () => {
    render(<ActionButtons {...defaultProps} selectedCount={0} />);
    
    const button = screen.getByText('Calculate Prices');
    expect(button).toBeDisabled();
  });

  it('should enable calculate button when products selected', () => {
    render(<ActionButtons {...defaultProps} selectedCount={2} />);
    
    const button = screen.getByText('Calculate Prices');
    expect(button).not.toBeDisabled();
  });

  it('should call onCalculate when button clicked', () => {
    const onCalculate = vi.fn();
    render(<ActionButtons {...defaultProps} onCalculate={onCalculate} />);
    
    const button = screen.getByText('Calculate Prices');
    fireEvent.click(button);
    
    expect(onCalculate).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    render(<ActionButtons {...defaultProps} loading={true} />);
    
    expect(screen.getByText('Calculating...')).toBeInTheDocument();
  });

  it('should show save section when showSaveSection is true', () => {
    render(<ActionButtons {...defaultProps} showSaveSection={true} />);
    
    expect(screen.getByPlaceholderText(/Profile name/)).toBeInTheDocument();
    expect(screen.getByText('Save Profile')).toBeInTheDocument();
  });

  it('should not show save section when showSaveSection is false', () => {
    render(<ActionButtons {...defaultProps} showSaveSection={false} />);
    
    expect(screen.queryByPlaceholderText(/Profile name/)).not.toBeInTheDocument();
    expect(screen.queryByText('Save Profile')).not.toBeInTheDocument();
  });

  it('should call onProfileNameChange when input changes', () => {
    const onProfileNameChange = vi.fn();
    render(
      <ActionButtons 
        {...defaultProps} 
        showSaveSection={true}
        onProfileNameChange={onProfileNameChange}
      />
    );
    
    const input = screen.getByPlaceholderText(/Profile name/);
    fireEvent.change(input, { target: { value: 'VIP Discount' } });
    
    expect(onProfileNameChange).toHaveBeenCalledWith('VIP Discount');
  });

  it('should disable save button when profile name is empty', () => {
    render(
      <ActionButtons 
        {...defaultProps} 
        showSaveSection={true}
        profileName=""
      />
    );
    
    const button = screen.getByText('Save Profile');
    expect(button).toBeDisabled();
  });

  it('should enable save button when profile name is provided', () => {
    render(
      <ActionButtons 
        {...defaultProps} 
        showSaveSection={true}
        profileName="VIP Discount"
      />
    );
    
    const button = screen.getByText('Save Profile');
    expect(button).not.toBeDisabled();
  });

  it('should call onSave when save button clicked', () => {
    const onSave = vi.fn();
    render(
      <ActionButtons 
        {...defaultProps} 
        showSaveSection={true}
        profileName="VIP Discount"
        onSave={onSave}
      />
    );
    
    const button = screen.getByText('Save Profile');
    fireEvent.click(button);
    
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});