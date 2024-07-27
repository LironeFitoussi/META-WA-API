const verifyToken = (req, res) => {
  const token = req.query.token;
  !token && res.sendStatus(404);
  if (token === process.env.VERIFY_TOKEN) {
    res.status(200).send(req.query.challenge);
  } else {
    res.sendStatus(403);
  }
};

const recivedMessage = (req, res) => {
  const body = req.body;
  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
};

export default { verifyToken, recivedMessage };