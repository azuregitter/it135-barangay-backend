import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/*const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "qwerty",
  database: "barangay",
});*/

const db = mysql.createConnection({
  host: "db4free.net",
  user: "barangayaguho_28",
  password: "barangayaguho_30",
  database: "barangayaguho_24",
});

app.get("/", (req, res) => {
  res.json(db);
});

app.get("/auth", (req, res) => {
  const q = "select username, privilege from accounts where username = ? and password = ?"
  console.log(req.query.username);
  console.log(req.query.password);
  db.query(q, [req.query.username, req.query.password],(err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log(data.length);
    if (data.length == 0){
      //no account found
      return res.json("nothing");
    } else {
      //yes account found
      return res.json(data);
    }
  });
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/accounts", (req, res) => {
  const q = "SELECT * FROM accounts";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});
app.get("/checkuser/:username", (req, res) => {
  const q = "SELECT username FROM accounts WHERE username = ?";
  console.log("look at it: " + req.params.username);
  db.query(q, [req.params.username],(err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log(data);
    return res.json(data);
  });
});

app.post("/accounts", (req, res) => {
  const q = "INSERT INTO accounts(`firstname`, `middlename`, `lastname`, `sex`,`dateofbirth`, `civilstatus`, `phonenumber`, `email`, `address`, `username`, `password`, `privilege`) VALUES (?)";

  const values = [
    req.body.firstname,
    req.body.middlename,
    req.body.lastname,
    req.body.sex,
    req.body.dateofbirth,
    req.body.civilstatus,
    req.body.phonenumber,
    req.body.email,
    req.body.address,
    req.body.username,
    req.body.password,
    req.body.privilege,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = " DELETE FROM books WHERE id = ? ";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values,bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Connected to backend.");
});
