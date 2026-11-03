import { describe, expect, it } from "vitest"
import { checkPassword, hashPassword } from "./passwords.js"

describe('passwords', () => {
    it('never stores the password itself', async () => {
        const hash = await hashPassword('correct horse battery')

        expect(hash).not.toContain('correct horse battery')
        expect(hash).toMatch(/^\$2b\$10\$/)
    })

    it('makes a different hash each time for the same password', async () => {
        const first = await hashPassword('correct horse battery')
        const second = await hashPassword('correct horse battery')

        expect(first).not.toBe(second)
    })

    it('accepts the right password and rejects a wrong one', async () => {
        const hash = await hashPassword('correct horse battery')

        expect(await checkPassword('correct horse battery', hash)).toBe(true)
        expect(await checkPassword('Correct horse battery', hash)).toBe(false)
    })
})