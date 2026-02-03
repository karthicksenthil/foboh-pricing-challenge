import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertMessage } from '../../components/AlertMessage';

describe('AlertMessage Component', () => {
  it('should render error message', () => {
    render(<AlertMessage type="error" message="An error occurred" />);
    
    expect(screen.getByText(/An error occurred/)).toBeInTheDocument();
    expect(screen.getByText(/✕/)).toBeInTheDocument();
  });

  it('should render success message', () => {
    render(<AlertMessage type="success" message="Operation successful" />);
    
    expect(screen.getByText(/Operation successful/)).toBeInTheDocument();
    expect(screen.getByText(/✓/)).toBeInTheDocument();
  });

  it('should call onDismiss when dismiss button clicked', () => {
    const onDismiss = vi.fn();
    render(<AlertMessage type="error" message="Error" onDismiss={onDismiss} />);
    
    const dismissButton = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should not render dismiss button when onDismiss not provided', () => {
    render(<AlertMessage type="error" message="Error" />);
    
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });

  it('should apply correct styling for error type', () => {
    const { container } = render(<AlertMessage type="error" message="Error" />);
    
    const alert = container.querySelector('.bg-red-50');
    expect(alert).toBeInTheDocument();
  });

  it('should apply correct styling for success type', () => {
    const { container } = render(<AlertMessage type="success" message="Success" />);
    
    const alert = container.querySelector('.bg-green-50');
    expect(alert).toBeInTheDocument();
  });
});