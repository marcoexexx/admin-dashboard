import { render, screen } from "@testing-library/react"
import { describe, it, expect } from 'vitest'
import App from '../App'


async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Renders main page correctly', async () => {
  it("Should render the page correctly", async () => {
    render(<App />)
    await wait(1000 * 2)

    const welcome = screen.getByText(/Network Error/)

    expect(welcome).toBeDefined()
  })
})
