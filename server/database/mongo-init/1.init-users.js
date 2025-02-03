db = db.getSiblingDB("ekhidata");

// USUARIOS
db.users.insertMany([
    {
        _id: ObjectId("507f1f77bcf86cd799439011"),
        username: "Alomorga",
        password:
            "$2a$10$80u1oHEBZ46kE3WVAObuH.udCnl6BsR1iM2RpLee56tFDq/fO.E5S",
        role: "user",
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439012"),
        username: "ilandatxe",
        password:
            "$2a$10$80u1oHEBZ46kE3WVAObuH.udCnl6BsR1iM2RpLee56tFDq/fO.E5S",
        role: "user",
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439012"),
        username: "FotosTorres",
        password:
            "$2a$10$80u1oHEBZ46kE3WVAObuH.udCnl6BsR1iM2RpLee56tFDq/fO.E5S",
        role: "commerce",
    }
]);