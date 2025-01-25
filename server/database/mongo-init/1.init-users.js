db = db.getSiblingDB("ekhilur");

// USUARIOS
db.users.insertMany([
    {
        username: "Alice Johnson",
        email: "alice@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        username: "Bob Smith",
        email: "bob@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        username: "Carol Williams",
        email: "carol@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        username: "Dave Brown",
        email: "dave@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        username: "Eve Davis",
        email: "eve@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        username: "Frank Moore",
        email: "frank@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        username: "Grace Lee",
        email: "grace@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        username: "Henry White",
        email: "henry@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
    },
    {
        username: "Irene Clark",
        email: "irene@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
    {
        username: "Jack Thompson",
        email: "jack@example.com",
        password:
            "$2a$10$uNyBDKZqTXxVz2TcOCL5NOR0WKaugbjXWrUTg3azJqiJbn9QqObQO",
        role: "user",
    },
]);
