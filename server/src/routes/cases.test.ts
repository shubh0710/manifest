import request from "supertest"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createApp } from "../app.js"
import { ActiveCaseError } from "../errors.js"
import { createCase, listCases } from "../services/casesService.js"
import type { OpenCase } from "../types/case.js"

// Swap the service for a stand-in, so these tests never touch the database
vi.mock('../services/casesService.js', () => ({
    listCases: vi.fn(),
    createCase: vi.fn(),
}))

const OPEN_CASE: OpenCase = {
    id: 'C-2026-0150',
    type: 'carrier',
    name: 'WERNER ENTERPRISES INC',
    dot: '53467',
    assignees: ['Alex Kim'],
    updatedAt: '2026-11-02T10:00:00.000Z',
    status: 'open',
    stage: 'Gathering documents',
}

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

describe('POST /api/cases', () => {
    it('creates the case and answers 201 with it', async () => {
        vi.mocked(createCase).mockResolvedValue(OPEN_CASE)

        const response = await request(createApp())
            .post('/api/cases')
            .send({ type: 'carrier', name: 'WERNER ENTERPRISES INC', dot: '53467' })

        expect(response.status).toBe(201)
        expect(response.body).toEqual(OPEN_CASE)
        expect(createCase).toHaveBeenCalledWith({
            type: 'carrier',
            name: 'WERNER ENTERPRISES INC',
            dot: '53467',
        })
    })

    it('answers 400 and saves nothing when the details are wrong', async () => {
        vi.mocked(createCase).mockClear()

        const response = await request(createApp())
            .post('/api/cases')
            .send({ type: 'carrier', name: 'WERNER ENTERPRISES INC', dot: 'abc' })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({ error: 'Enter a USDOT number of 1 to 8 digits' })
        expect(createCase).not.toHaveBeenCalled()
    })

    it('answers 409 with the existing case when one is in progress', async () => {
        vi.mocked(createCase).mockRejectedValue(new ActiveCaseError('C-2026-0147'))

        const response = await request(createApp())
            .post('/api/cases')
            .send({ type: 'carrier', name: 'WERNER ENTERPRISES INC', dot: '53467' })

        expect(response.status).toBe(409)
        expect(response.body).toEqual({
            error: 'This company already has a case in progress',
            caseId: 'C-2026-0147',
        })
    })

    it('answers 400 when the request is not valid JSON', async () => {
        const response = await request(createApp())
            .post('/api/cases')
            .set('Content-Type', 'application/json')
            .send('{ not json')

        expect(response.status).toBe(400)
        expect(response.body).toEqual({ error: 'The request was not valid JSON' })
    })
})