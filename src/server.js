const http = require("http");
const fs = require("fs").promises;

const host = "localhost";
const port = 3000;

const html = `
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
    <style>
        *,
        html {
            margin: 0;
            padding: 0;
            border: 0;
        }

        html {
            width: 100%;
            height: 100%;
        }

        body {
            width: 100%;
            height: 100%;
            position: relative;
            background-color: rgb(236, 152, 42);
        }

        .center {
            width: 100%;
            height: 50%;
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-family: "Trebuchet MS", Helvetica, sans-serif;
            text-align: center;
        }

        h1 {
            font-size: 144px;
        }

        p {
            font-size: 64px;
        }
    </style>
</head>
  <body>
  
    <h1>The optgroup element</h1>

    <p>
      The optgroup tag is used to group related options in a drop-down list:
    </p>

    <form action="/action_page.php">
      <label for="cars">Choose a car:</label>
      <select name="cars" id="cars">
        <optgroup label="Swedish Cars">
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
        </optgroup>
        <optgroup label="German Cars">
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </optgroup>
      </select>
      <br /><br />
      <input type="submit" value="Submit" />
    </form>
  </body>
</html>
`;

const server = http.createServer((req, res) => {
  try {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(html);
  } catch (err) {
    res.writeHead(500);
    res.end(err);
  }
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
