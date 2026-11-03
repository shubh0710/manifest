import { prisma } from "../db.js"
import { EmailTakenError, WrongLogInError, WrongSignUpCodeError } from "../errors.js"
import type { Prisma } from "../generated/prisma/client.js"
import { checkPassword, hashPassword } from "../passwords.js"
import { isUniqueClash } from "../prismaErrors.js"
import type { LogInDetails, SignUpDetails } from "../validation/credentials.js"

// What the screens may know about a person: never the password hash
const PUBLIC_USER = { id: true, name: true, email: true } satisfies Prisma.UserSelect

export type PublicUser = Prisma.UserGetPayload<{ select: typeof PUBLIC_USER }>

// Makes an account and gives back the new person
export async function signUp(details: SignUpDetails): Promise<PublicUser> {
    // Checked first, so someone without the code can't even find out which emails have an account
    if (!isRightSignUpCode(details.code)) {
        throw new WrongSignUpCodeError()
    }

    try {
        return await prisma.user.create({
            data: {
                name: details.name,
                email: details.email,
                passwordHash: await hashPassword(details.password),
            },
            select: PUBLIC_USER,
        })
    } catch (error) {
        // The email column is unique, so a second account with the same email is turned down
        if (isUniqueClash(error)) {
            throw new EmailTakenError()
        }
        throw error
    }
}

// Finds the person with this email and password, or says no
export async function logIn(details: LogInDetails): Promise<PublicUser> {
    const user = await prisma.user.findUnique({ where: { email: details.email } })
    if (!user || !(await checkPassword(details.password, user.passwordHash))) {
        throw new WrongLogInError()
    }
    return { id: user.id, name: user.name, email: user.email }
}

// Sign-up stays closed until a code is set in the settings
function isRightSignUpCode(code: string) {
    const expected = process.env.SIGNUP_CODE
    return Boolean(expected) && code === expected
}