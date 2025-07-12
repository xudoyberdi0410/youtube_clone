import React from 'react';
import { render, screen } from '@testing-library/react';
import ShortsList from '../ShortsList';

// Mock the ShortsCard component
jest.mock('../ShortsCard', () => {
  return function MockShortsCard() {
    return <div data-testid="shorts-card">ShortsCard Component</div>;
  };
});

describe('ShortsList', () => {
  it('should render the component correctly', () => {
    render(<ShortsList />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'min-h-screen', 'bg-background', 'text-foreground');
  });

  it('should render the main heading', () => {
    render(<ShortsList />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Shorts');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'mb-8');
  });

  it('should render the ShortsCard component', () => {
    render(<ShortsList />);
    
    const shortsCard = screen.getByTestId('shorts-card');
    expect(shortsCard).toBeInTheDocument();
    expect(shortsCard).toHaveTextContent('ShortsCard Component');
  });

  it('should have correct container structure', () => {
    render(<ShortsList />);
    
    const container = screen.getByTestId('shorts-card').parentElement;
    expect(container).toHaveClass('w-full', 'flex', 'flex-col', 'items-center', 'gap-8');
  });

  it('should have proper layout structure', () => {
    render(<ShortsList />);
    
    // Check if main container exists
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    
    // Check if heading exists
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    
    // Check if ShortsCard exists
    const shortsCard = screen.getByTestId('shorts-card');
    expect(shortsCard).toBeInTheDocument();
    
    // Check hierarchy
    expect(main).toContainElement(heading);
    expect(main).toContainElement(shortsCard.parentElement);
  });

  it('should have correct spacing and layout classes', () => {
    render(<ShortsList />);
    
    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'min-h-screen', 'bg-background', 'text-foreground');
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'mb-8');
    
    const container = screen.getByTestId('shorts-card').parentElement;
    expect(container).toHaveClass('w-full', 'flex', 'flex-col', 'items-center', 'gap-8');
  });
}); 