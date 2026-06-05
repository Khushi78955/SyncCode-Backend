const {z} = require("zod")

const createRoomSchema = z.object({
    title: z.string().min(1),
    language: z.enum([
        "JAVASCRIPT",
        "PYTHON",
        "JAVA",
        "CPP"
    ])
})

const joinRoomSchema = z.object({
    roomCode: z.string().length(6)
})

const updateRoomSchema = z.object({
    title: z.string().min(1).optional(),
    language: z.enum([
        "JAVASCRIPT",
        "PYTHON",
        "JAVA",
        "CPP"
    ]).optional()
})


module.exports = {createRoomSchema, joinRoomSchema, updateRoomSchema}