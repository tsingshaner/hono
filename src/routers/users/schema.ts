import * as v from 'valibot'

export const userIdSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty())
})

export const createUserSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  emailVerified: v.optional(v.boolean(), false),
  id: v.optional(v.pipe(v.string(), v.nonEmpty())),
  image: v.optional(v.nullable(v.string())),
  name: v.pipe(v.string(), v.nonEmpty())
})

export const updateUserSchema = v.partial(
  v.object({
    email: v.pipe(v.string(), v.email()),
    emailVerified: v.boolean(),
    image: v.nullable(v.string()),
    name: v.pipe(v.string(), v.nonEmpty())
  })
)

export type CreateUserInput = v.InferOutput<typeof createUserSchema>
export type UpdateUserInput = v.InferOutput<typeof updateUserSchema>
