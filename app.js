"useStrict";

const express = require("express");
const bodyParser = require("body-parser");
const sgMail = require("@sendgrid/mail");

require("dotenv").config();

const app = express();
const port = 3001;

app.use(bodyParser.json());
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getHtml = (comics) => `<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <div style="margin: 0; padding: 0; background-color: #fefefe; font-family: monospace; width: 100%">
    <h1 style="text-align: center; padding: 25px 25px 0; margin: 0; color: #ff0000">Marvel Comics</h1>
    <p style="text-align: center; padding: 10px 10px 35px; margin: 0; color: #333333">
      The best comics always at your disposal
    </p>
  </div>
  <div style="display: block;">
  ${comics.reduce(
    (total, comic) => `
      ${total}
      <div style="
        width: 100%;
        max-width: 350px;
        margin: 25px;
        box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.24);
        border: 1px solid rgba(0,0,0,0.24);
        border-radius: 5px;
        float: left;
      "
      >
        <a
          href="${comic.urls.length ? comic.urls[0].url : "#"}"
          style="text-decoration: none; color: inherit"
        >
          <div style="max-width: 350px; max-height: 300px">
            <img
              alt="${comic.id}"
              src="${comic.thumbnail.path}.${comic.thumbnail.extension}"
              style="object-fit: cover; width: 100%; height: 100%; max-width: 350px; max-height: 300px"
            />
          </div>
          <h2 style="color: #333333; padding: 0 16px">${comic.title}</h2>
          <p style="color: #333333; padding: 0 16px">${comic.description || "..."}</p>
          ${
            comic.pageCount > 0
              ? `<div>
              <p style="color: #333333; padding: 0 16px; text-align: center"><b>Number of pages</b> <span>${comic.pageCount}</span></p>
            </div>`
              : ``
          }
        </a>
      </div>`,
    ""
  )}
  </div>
  <div style="width: 100%; padding-top: 50px; clear: both">
    <p style="color: #333333; text-align: center">
      We appreciate the preference and we wait for you to follow the news with us
    </p>
    <p style="color: #333333; text-align: center">Data provided by Marvel. © 2021 MARVEL</p>
  </div>
</body>
</html>
`;

app.get("/", (req, res) => {
  res.send("Deu certo");
});

app.post("/", async (req, res) => {
  let { mail, comics } = req.body;

  if (!mail) res.status(400).send("The recipient is mandatory");
  if (!comics.length) res.status(400).send("Unable to send email without comics");

  let msg = {
    to: mail,
    from: "mhfgmv@gmail.com",
    subject: "Marvel Comics",
    text: "The best comics always at your disposal",
    html: getHtml(comics),
  };

  res.send(
    await sgMail
      .send(msg)
      .then(() => ({ success: true }))
      .catch((err) => ({
        success: false,
        message: err.message,
      }))
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
