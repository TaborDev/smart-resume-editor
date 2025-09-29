import { render, screen } from '@testing-library/react'
import HomePage from '../app/page'

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading', {
      name: /smart resume editor/i,
    })
    
    expect(heading).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<HomePage />)
    
    const description = screen.getByText(/real-time resume editing during job applications/i)
    
    expect(description).toBeInTheDocument()
  })
})