const Pusher = require("pusher");
module.exports = {
  sendMessage: (req, res) => {
    try {
      const pusher = new Pusher({
        appId: process.env.app_id,
        key: process.env.key,
        secret: process.env.secret,
        cluster: process.env.cluster,
        useTLS: true,
      });
      pusher.trigger("", "", {
        message: req.body.message,
      });
      res.send("message sent");
    } catch (error) {}
  },
};
