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
  database: "barangayaguho_24",
});*/

const db = mysql.createPool({
  connectionLimit : 10,
  acquireTimeout  : 10000,
  host: "db4free.net",
  user: "barangayaguho_28",
  password: "barangayaguho_30",
  database: "barangayaguho_24",
});

app.get("/", (req, res) => {
  res.json(db);
});

app.get("/auth", (req, res) => {
  const q = "select username, privilege from accounts where username = ? and password = ?";
  console.log(req.query.username);
  console.log(req.query.password);
  db.query(q, [req.query.username, req.query.password],(err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log(data.length);
    if (data.length === 0){
      //no account found
      return res.json("nothing");
    } else {
      //yes account found
      return res.json(data);
    }
  });
});

app.get("/officials", (req, res) => {
  const q = "SELECT * FROM Officials";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/updateofficials", (req, res) => {
  let q = "UPDATE Officials SET `Punong`=?, `Livelihood`=?, `Finance`=?, `Health`=?, `Environmental`=?, `Infrastructure`=?, `Peace`=?, `Education`=?, `Youth`=?, `Treasurer`=?, `Secretary`=? WHERE `OfficialID`=1";
  db.query(q,
   [req.body.Punong,
    req.body.Livelihood,
    req.body.Finance,
    req.body.Health,
    req.body.Environmental,
    req.body.Infrastructure,
    req.body.Peace,
    req.body.Education,
    req.body.Youth,
    req.body.Treasurer,
    req.body.Secretary], (err, data) => {
    if (err) {
      console.log(err);
      return res.send(err);
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
app.get("/checkuserdocs/:username", (req, res) => {
  const q = "SELECT * FROM Forms WHERE username = ?";
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
app.get("/checkadmindocs/:status?/:user?", (req, res) => {
  if (!req.params.status){
    req.params.status = 'Pending';
  }
  if (!req.params.user){
    const q = "SELECT * FROM Forms WHERE Status = ?";
    db.query(q, [req.params.status],(err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      //console.log(data);
      return res.json(data);
    });
  } else {
      req.params.user = req.params.user + '%';
    const q = "SELECT * FROM Forms WHERE Status = ? AND (username like ? or fullname like ?)";
    db.query(q, [req.params.status, req.params.user, req.params.user],(err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      //console.log(data);
      return res.json(data);
    });
  }
});

app.get("/viewuserdocs/:username/:id/:type", (req, res) => {
  let values = [
    req.params.username,
    req.params.id,
  ];
  let q;
  if (req.params.type === 'Proof of Residence'){
    q = "select * from Forms INNER JOIN Residence on Forms.FormID = Residence.ResidenceID WHERE username = ? and FormID = ?";
  }else if (req.params.type === 'Indigence Certification'){
    q = "select * from Forms INNER JOIN Indigent on Forms.FormID = Indigent.IndigentID WHERE username = ? and FormID = ?";
  }
  db.query(q, [req.params.username, req.params.id],(err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    console.log(data);
    return res.json(data);
  });
});

app.post("/submitresident", (req, res) => {
  let q = "BEGIN";
  console.log('begin residence');
  db.query(q);
  q = "INSERT INTO Forms (`FormType`, `username`,`fullname`,`AppDate`,`Status`) VALUES(?)";
  let values = [
    req.body.FormType,
    req.body.username,
    req.body.fullname,
    req.body.AppDate,
    req.body.Status,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
  });
  values = [
    req.body.fullname,
    req.body.Address,
  ];
  q = "INSERT INTO Residence (ResidenceID, Name, Address) VALUES(LAST_INSERT_ID(),?)";
  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
  });
  console.log('commit residence');
  q = "Commit";
  db.query(q);
});

app.post("/submitindigent", (req, res) => {
  let q = "BEGIN";
  console.log('begin indigent');
  db.query(q);
  q = "INSERT INTO Forms (`FormType`, `username`,`fullname`,`AppDate`,`Status`) VALUES(?)";
  let values = [
    req.body.FormType,
    req.body.username,
    req.body.fullname,
    req.body.AppDate,
    req.body.Status,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
  });
  values = [
    req.body.fullname,
    req.body.Address,
    req.body.RName,
  ];
  q = "INSERT INTO Indigent (IndigentID, PName, PAddress, RName) VALUES(LAST_INSERT_ID(),?)";
  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
  });
  q = "Commit";
  console.log('commit indigent');
  db.query(q);
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

app.delete("/deletedocs/:id/:type", (req, res) => {
  const value = req.params.id;
  let q;
  if (req.params.type === 'Proof of Residence'){
    q = " DELETE FROM Residence WHERE ResidenceID = ? ";
    console.log(q);
  }else if (req.params.type === 'Indigence Certification'){
    q = " DELETE FROM Indigent WHERE IndigentID = ? ";
    console.log(q);
  }

  db.query(q, [value], (err, data) => {
    if (err) return res.send(err);
    //return res.json(data);
  });
  q = " DELETE FROM Forms WHERE FormID = ? ";

  db.query(q, [value], (err, data) => {
    if (err) return res.send(err);
    //return res.json(data);
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

app.put("/docstatus/:id/:status", (req, res) => {
  const q = "UPDATE Forms set Status = ? where FormID = ?";

  db.query(q, [req.params.status,req.params.id], (err, data) => {
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
