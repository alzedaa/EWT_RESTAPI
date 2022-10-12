// Starter code for a REST API, feel free to use this to help with Assignment #1

const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const express = require('express');
const app = express();

// use JSON middleware to parse request bodies and put result into req.body
app.use(express.json());

app.get("/api/:id", async function(req,res) {
  console.log("get request with parameter");
  const data = 
    await db.all("SELECT * FROM Movies WHERE rowid ==" +req.params.id);
    
  console.log(JSON.stringify(data));  
  res.send(JSON.stringify(data));
});

app.put("/api", async function(req,res) {
  let title = req.query.title;
  let release_year = req.query.release_year;
  let time_viewed = req.query.time_viewed;
  
  const deleteTable = await db.run("DROP TABLE IF EXISTS Movies");
  const recreateTable = await db.run("CREATE TABLE Movies (title TEXT, release_year TEXT, time_viewed DATETIME)");
  const insertedIntoTable = await db.run("INSERT INTO Movies VALUES(?, ?, ?)", title, release_year, time_viewed);
  deleteTable; recreateTable; insertedIntoTable;
  if (res.statusCode == 200) {
    return res.json('status: TABLE REPLACED SUCCESSFULLY');
  }
  else {
    return res.json('status: It no worky :(')
  }

});

app.post('/api', async function(req, res){
  let title = req.query.title;
  let release_year = req.query.release_year;
  let time_viewed = req.query.time_viewed;
  console.log(title, release_year, time_viewed);
  const insertedIntoTable = await db.run("INSERT INTO Movies VALUES(?, ?, ?)", title, release_year, time_viewed);

  res.json(insertedIntoTable)
}
);

app.delete('/api', async function(req, res){
  const deleteTable = await db.run("DROP TABLE IF EXISTS Movies");
  res.json(deleteTable);
});


app.delete('/api/:id', async function(req, res){
  const deleteItem = await db.run("DELETE FROM Movies WHERE rowid = ?", req.params.id);
  res.json(deleteItem);
});



// GET the entire collection, send it back as JSON data
app.get("/api", async function(req,res)
{
  // acknowledge request received on the console for debugging
  console.log("GET COLLECTION REQUEST RECEIVED");
  
  // get the data to be sent back 
  const data = 
    await db.all("SELECT rowid as id, title, release_year, time_viewed FROM Movies");
  
  // output data to console for debugging
  console.log(JSON.stringify(data));

  // send back table data as JSON data
  res.json(data);
});

// creates the database and table of data to be managed, then starts the server
async function startup()
{
  // create the database connection
  db = await sqlite.open({
    filename: 'api.db',
    driver: sqlite3.Database
  });
  
  // create 
  await db.run("DROP TABLE IF EXISTS Movies");
  await db.run("CREATE TABLE Movies (title TEXT, release_year TEXT, time_viewed DATETIME)");
 
  // insert initial records into the table... the REST api you create for 
  // the assignment should NOT do this, it should start off with no data in 
  // it... we do it in this starter code for debugging purposes
  var stmt = await db.prepare("INSERT INTO Movies VALUES (?,?,?)");
  await stmt.run("Barks when happy", "2000", "2000-08-08 05:00:00");
  await stmt.run("Barks when fadiaosp[appy", "2000", "2000-08-08 05:00:00");
  stmt.finalize();

  // start the server
  const server = app.listen(3000, function(){
    console.log("RESTful API listening on port 3000!")
  });
}

startup();
