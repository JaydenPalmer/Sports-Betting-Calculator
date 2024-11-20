const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("./database/database.json"); // adjust this path to where your database.json is
const middlewares = jsonServer.defaults();

// Disable cascade deletes
router.render = (req, res) => {
  if (req.method === "DELETE" && req.url.startsWith("/tails")) {
    // Only delete the tail, don't touch related records
    const tailId = req.url.split("/").pop();
    const db = router.db;
    db.get("tails")
      .remove({ id: parseInt(tailId) })
      .write();
    res.jsonp({});
  } else {
    res.jsonp(res.locals.data);
  }
};

server.use(middlewares);
server.use(router);

server.listen(8088, () => {
  console.log("JSON Server is running on port 8088");
});
