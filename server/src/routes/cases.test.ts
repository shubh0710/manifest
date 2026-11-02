import request from "supertest"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createApp } from "../app.js"
import { listCases } from "../services/casesService.js"

// Swap the service for a stand-in, so these tests never touch the database
vi.mock('../services/casesService.js', () => ({
    listCases: vi.fn(),
}))

afterEach(() => {
    vi.restoreAllMocks()
})

describe('GET /api/cases', () => {
    it('sends back the list of cases', async () => {
        vi.mocked(listCases).mockResolvedValue([
            {
                id: 'C-2026-0141',
                type: 'carrier',
                name: 'J. B. HUNT TRANSPORT, INC.',
                assignees: ['Alex Kim'],
                updatedAt: '2026-10-17T10:15:00.000Z',
                status: 'open',
                stage: 'Gathering documents',
            },
        ])

        const response = await request(createApp()).get('/api/cases')

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(1)
        expect(response.body[0].id).toBe('C-2026-0141')
    })

    it('answers 500 with a short message when something breaks', async () => {
        vi.mocked(listCases).mockRejectedValue(new Error('Database is down'))
        // Keep the expected error out of the test output
        vi.spyOn(console, 'error').mockImplementation(() => { })

        const response = await request(createApp()).get('/api/cases')

        expect(response.status).toBe(500)
        expect(response.body).toEqual({ error: 'Something went wrong on the server' })
    })
})