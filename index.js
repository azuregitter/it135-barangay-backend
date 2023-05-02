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

/*const db = mysql.createConnection({
  host: "db4free.net",
  user: "barangayaguho_28",
  password: "barangayaguho_30",
  database: "barangayaguho_24",
});*/

app.get("/", (req, res) => {
  res.json(db);
});
app.get("/delet", (req, res) => {
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

app.post("/updatepunongimg", (req, res) => {
  console.log(req.body.img)
  let q = "UPDATE Officials set `PunongIMG`= ? where OfficialID = 1;";
  db.query(q,
      [req.body.img], (err, data) => {
        if (err) {
          console.log(err);
          return res.send(err);
        }
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
app.get("/checkuseredit/:username", (req, res) => {
  const q = "select firstname, middlename, lastname, sex, dateofbirth, civilstatus, phonenumber, address from accounts where username= ?";
  console.log("edit profile : " + req.params.username);
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

app.get("/checkaccounts/:user?", (req, res) => {
  if (!req.params.user){
    const q = "SELECT userid, firstname, middlename, lastname, username, privilege FROM accounts WHERE username != 'mainadmin'";
    db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      console.log(data);
      return res.json(data);
    });
  } else {
    req.params.user = req.params.user + '%';
    const q = "SELECT userid, firstname, middlename, lastname, username, privilege FROM accounts WHERE username != 'mainadmin' AND (username like ? or firstname like ? or middlename like ? or lastname like ?)";
    db.query(q, [req.params.user, req.params.user, req.params.user, req.params.user],(err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      //console.log(data);
      return res.json(data);
    });
  }
});

app.put("/updateadmin/:username/:privilege", (req, res) => {
  const q = "UPDATE accounts SET `privilege`= ? WHERE username = ?";
  db.query(q, [req.params.privilege,req.params.username], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.post("/editaccount/:username", (req, res) => {
  console.log(req.body);
  console.log(req.params.username);
  const q = "UPDATE accounts SET firstname = ?, middlename = ?, lastname = ?, civilstatus = ?, phonenumber = ?, address = ?  WHERE username = ?";
  db.query(q, [req.body.firstname, req.body.middlename, req.body.lastname, req.body.civilstatus, req.body.phonenumber, req.body.address ,req.params.username], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
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
  }else if (req.params.type === 'Business Clearance'){
    q = "select * from Forms INNER JOIN Business on Forms.FormID = Business.BusinessID WHERE username = ? and FormID = ?";
  }else if (req.params.type === 'Working Permit Clearance'){
    q = "select * from Forms INNER JOIN Working on Forms.FormID = Working.WorkingID WHERE username = ? and FormID = ?";
  }else if (req.params.type === 'Barangay ID'){
    q = "select * from Forms INNER JOIN BarangayID on Forms.FormID = BarangayID.BarangayID WHERE username = ? and FormID = ?";
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
  db.getConnection(function (err, conn) {
    if (err) return console.log(err);
    let q = "BEGIN";
    console.log('begin residence');
    conn.query(q, function (err, rows) {
      if (err) throw err;
      q = "INSERT INTO Forms (`FormType`, `username`,`fullname`,`AppDate`,`Status`) VALUES(?)";
      let id;
      let values = [
        req.body.FormType,
        req.body.username,
        req.body.fullname,
        req.body.AppDate,
        req.body.Status,
      ];
      console.log(values);
      conn.query(q, [values], function (err, data) {
        if (err) throw err;
        id = data.insertId;
        values = [
          req.body.fullname,
          req.body.Address,
        ];
        q = "INSERT INTO Residence (ResidenceID, Name, Address) VALUES(?,?)";
        console.log(values);
        conn.query(q, [id,values], function (err, data) {
          if (err) throw err;
          q = 'Commit';
          console.log('commit residence');
          conn.query(q, function (err, data) {
            if (err) throw err;
            conn.release();
          });
        });
      });
    });
  });
});

app.post("/submitindigent", (req, res) => {
  db.getConnection(function (err, conn) {
    if (err) return console.log(err);
    let q = "BEGIN";
    console.log('begin indigent');
    conn.query(q, function (err, rows) {
      if (err) throw err;
      q = "INSERT INTO Forms (`FormType`, `username`,`fullname`,`AppDate`,`Status`) VALUES(?)";
      let id;
      let values = [
        req.body.FormType,
        req.body.username,
        req.body.fullname,
        req.body.AppDate,
        req.body.Status,
      ];
      console.log(values);
      conn.query(q, [values], function (err, data) {
        if (err) throw err;
        id = data.insertId;
        values = [
          req.body.fullname,
          req.body.Address,
          req.body.RName,
        ];
        q = "INSERT INTO Indigent (IndigentID, PName, PAddress, RName) VALUES(?,?)";
        console.log(values);
        conn.query(q, [id,values], function (err, data) {
          if (err) throw err;
          q = 'Commit';
          console.log('commit indigent');
          conn.query(q, function (err, data) {
            if (err) throw err;
            conn.release();
          });
        });
      });
    });
  });
});

app.post("/submitbusiness", (req, res) => {
  db.getConnection(function (err, conn) {
    if (err) return console.log(err);
    let q = "BEGIN";
    console.log('begin business');
    conn.query(q, function (err, rows) {
      if (err) throw err;
      q = "INSERT INTO Forms (`FormType`, `username`,`fullname`,`AppDate`,`Status`) VALUES(?)";
      let id;
      let values = [
        req.body.FormType,
        req.body.username,
        req.body.BWname,
        req.body.AppDate,
        req.body.Status,
      ];
      console.log(values);
      conn.query(q, [values], function (err, data) {
        if (err) throw err;
        id = data.insertId;
        values = [
          req.body.BWname,
          req.body.BWaddress,
          req.body.Oname,
          req.body.Oaddress,
        ];
        q = "INSERT INTO Business (BusinessID, BName, BAddress, OName, OAddress) VALUES(?,?)";
        console.log(values);
        conn.query(q, [id,values], function (err, data) {
          if (err) throw err;
          q = 'Commit';
          console.log('commit business');
          conn.query(q, function (err, data) {
            if (err) throw err;
            conn.release();
          });
        });
      });
    });
  });
});

app.post("/submitworking", (req, res) => {
  db.getConnection(function (err, conn) {
    if (err) return console.log(err);
    let q = "BEGIN";
    console.log('begin working');
    conn.query(q, function (err, rows) {
      if (err) throw err;
      q = "INSERT INTO Forms (`FormType`, `username`,`fullname`,`AppDate`,`Status`) VALUES(?)";
      let id;
      let values = [
        req.body.FormType,
        req.body.username,
        req.body.BWname,
        req.body.AppDate,
        req.body.Status,
      ];
      console.log(values);
      conn.query(q, [values], function (err, data) {
        if (err) throw err;
        id = data.insertId;
        values = [
          req.body.BWname,
          req.body.BWaddress,
          req.body.Oname,
          req.body.Oaddress,
        ];
        q = "INSERT INTO Working (WorkingID, WName, WAddress, OName, OAddress) VALUES(?,?)";
        console.log(values);
        conn.query(q, [id,values], function (err, data) {
          if (err) throw err;
          q = 'Commit';
          console.log('commit working');
          conn.query(q, function (err, data) {
            if (err) throw err;
            conn.release();
          });
        });
      });
    });
  });
});

app.post("/submitbid/", (req, res) => {
  db.getConnection(function (err, conn) {
    if (err) return console.log(err);
    let q = "BEGIN";
    console.log('begin barangay id');
    conn.query(q, function (err, rows) {
      if (err) throw err;
      q = "INSERT INTO Forms (`FormType`, `username`,`fullname`,`AppDate`,`Status`) VALUES(?)";
      let id;
      let values = [
        req.body.Submission.FormType,
        req.body.Submission.username,
        req.body.Submission.idname,
        req.body.Submission.AppDate,
        req.body.Submission.Status,
      ];
      console.log(values);
      conn.query(q, [values], function (err, data) {
        if (err) throw err;
        id = data.insertId;
        values = [
          req.body.Submission.idname,
          req.body.Submission.address,
          req.body.Submission.birthdate,
          req.body.Submission.bloodtype,
          req.body.Submission.weight,
          req.body.Submission.height,
          req.body.Bimg,
          req.body.Submission.emergencyname,
          req.body.Submission.emergencyaddress,
          req.body.Submission.emergencynumber,
        ];
        q = "INSERT INTO BarangayID (BarangayID, Name, Address, Birthdate, `Blood Type`, Weight, Height, IDimg, CName, CAddress, ContactNo) VALUES(?,?)";
        console.log(values);
        conn.query(q, [id,values], function (err, data) {
          if (err) throw err;
          q = 'Commit';
          console.log('commit barangay id');
          conn.query(q, function (err, data) {
            if (err) throw err;
            conn.release();
          });
        });
      });
    });
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

app.delete("/deletedocs/:id/:type", (req, res) => {
  const value = req.params.id;
  let q;
  if (req.params.type === 'Proof of Residence'){
    q = " DELETE FROM Residence WHERE ResidenceID = ? ";
    console.log(q);
  }else if (req.params.type === 'Indigence Certification'){
    q = " DELETE FROM Indigent WHERE IndigentID = ? ";
    console.log(q);
  }else if (req.params.type === 'Business Clearance'){
    q = " DELETE FROM Business WHERE BusinessID = ? ";
    console.log(q);
  }else if (req.params.type === 'Working Permit Clearance'){
    q = " DELETE FROM Working WHERE WorkingID = ? ";
    console.log(q);
  }else if (req.params.type === 'Barangay ID'){
    q = " DELETE FROM BarangayID WHERE BarangayID = ? ";
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
