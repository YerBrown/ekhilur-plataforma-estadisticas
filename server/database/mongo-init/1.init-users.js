db = db.getSiblingDB("ekhilur");

// USUARIOS
db.users.insertMany([
    {
        _id: ObjectId("507f1f77bcf86cd799439011"),
        username: "Alice Johnson",
        email: "alice@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439012"),
        username: "Bob Smith",
        email: "bob@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439013"),
        username: "Carol Williams",
        email: "carol@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439014"),
        username: "Dave Brown",
        email: "dave@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439015"),
        username: "Eve Davis",
        email: "eve@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439016"),
        username: "Frank Moore",
        email: "frank@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439017"),
        username: "Grace Lee",
        email: "grace@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439018"),
        username: "Henry White",
        email: "henry@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439019"),
        username: "Irene Clark",
        email: "irene@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439020"),
        username: "Jack Thompson",
        email: "jack@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
]);
