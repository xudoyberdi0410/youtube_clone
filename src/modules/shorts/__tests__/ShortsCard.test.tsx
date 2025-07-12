import React from 'react';
import { render, screen } from '@testing-library/react';
import ShortsCard from '../ShortsCard';

describe('ShortsCard', () => {
  it('should render the component correctly', () => {
    render(<ShortsCard />);
    
    // Check if main container is rendered
    const container = screen.getByTestId('shorts-card-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('relative', 'w-full', 'max-w-xs', 'mx-auto', 'aspect-[9/16]', 'bg-card', 'rounded-xl', 'overflow-hidden', 'flex', 'items-center', 'justify-center', 'shadow-lg');
  });

  it('should display video preview placeholder', () => {
    render(<ShortsCard />);
    
    const videoPreview = screen.getByText('Видео-превью');
    expect(videoPreview).toBeInTheDocument();
    expect(videoPreview).toHaveClass('text-muted-foreground');
  });

  it('should render like button with correct accessibility', () => {
    render(<ShortsCard />);
    
    const likeButton = screen.getByRole('button', { name: /like/i });
    expect(likeButton).toBeInTheDocument();
    expect(likeButton).toHaveClass('bg-zinc-800', 'bg-opacity-80', 'rounded-full', 'p-3', 'hover:bg-zinc-700', 'transition');
    
    const likeIcon = screen.getByRole('img', { name: 'like' });
    expect(likeIcon).toBeInTheDocument();
    expect(likeIcon).toHaveTextContent('👍');
  });

  it('should render comment button with correct accessibility', () => {
    render(<ShortsCard />);
    
    const commentButton = screen.getByRole('button', { name: /comment/i });
    expect(commentButton).toBeInTheDocument();
    expect(commentButton).toHaveClass('bg-zinc-800', 'bg-opacity-80', 'rounded-full', 'p-3', 'hover:bg-zinc-700', 'transition');
    
    const commentIcon = screen.getByRole('img', { name: 'comment' });
    expect(commentIcon).toBeInTheDocument();
    expect(commentIcon).toHaveTextContent('💬');
  });

  it('should render share button with correct accessibility', () => {
    render(<ShortsCard />);
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toHaveClass('bg-zinc-800', 'bg-opacity-80', 'rounded-full', 'p-3', 'hover:bg-zinc-700', 'transition');
    
    const shareIcon = screen.getByRole('img', { name: 'share' });
    expect(shareIcon).toBeInTheDocument();
    expect(shareIcon).toHaveTextContent('↗️');
  });

  it('should render video information section', () => {
    render(<ShortsCard />);
    
    const videoInfo = screen.getByText('Название короткого видео');
    expect(videoInfo).toBeInTheDocument();
    expect(videoInfo).toHaveClass('text-lg', 'font-semibold');
    
    const videoDescription = screen.getByText('Описание или автор');
    expect(videoDescription).toBeInTheDocument();
    expect(videoDescription).toHaveClass('text-zinc-400', 'text-sm');
  });

  it('should have correct layout structure', () => {
    render(<ShortsCard />);
    
    // Check if all interactive elements are present
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3); // like, comment, share buttons
    
    // Check if all text content is present
    expect(screen.getByText('Видео-превью')).toBeInTheDocument();
    expect(screen.getByText('Название короткого видео')).toBeInTheDocument();
    expect(screen.getByText('Описание или автор')).toBeInTheDocument();
  });

  it('should have proper positioning for control buttons', () => {
    render(<ShortsCard />);
    
    const controlButtonsContainer = screen.getByRole('button', { name: /like/i }).parentElement;
    expect(controlButtonsContainer).toHaveClass('absolute', 'right-2', 'top-1/4', 'flex', 'flex-col', 'gap-4', 'items-center', 'z-10');
  });

  it('should have proper positioning for video info', () => {
    render(<ShortsCard />);
    
    const videoInfoContainer = screen.getByTestId('video-info-container');
    expect(videoInfoContainer).toHaveClass('absolute', 'bottom-0', 'left-0', 'w-full', 'p-4', 'bg-gradient-to-t', 'from-black/80', 'to-transparent');
  });
}); 