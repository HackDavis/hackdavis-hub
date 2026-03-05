import React from 'react';
import { render, screen } from '@testing-library/react';
import PrizeTracksPage from '../app/prize-tracks/page';

describe('PrizeTracksPage', () => {
  it('renders the prize tracks titles', () => {
    render(<PrizeTracksPage />);
    expect(screen.getByText('Prize Tracks')).toBeInTheDocument();
    expect(screen.getByText('Best Hack for Social Good')).toBeInTheDocument();
    expect(screen.getByText('Best Beginner Hack')).toBeInTheDocument();
    expect(screen.getByText("Hacker's Choice Award")).toBeInTheDocument();
  });
});
