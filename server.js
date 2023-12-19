const express = require("express");
const bodyParser = require("body-parser");
const dapr = require("@dapr/dapr");

const app = express();
const PORT = 3344;
const DAPR_HOST = process.env.CNS_DAPR_HOST || "localhost";
const DAPR_PORT = process.env.CNS_DAPR_PORT || "3500";

const CNS_DAPR = process.env.CNS_DAPR || "cns-dapr";
const CNS_CONTEXT = process.env.CNS_CONTEXT || "Uud1c8RS2YQTqQ3u47eg";

// Dapr client

const client = new dapr.DaprClient({
  daprHost: DAPR_HOST,
  daprPort: DAPR_PORT,
});

// Client application
async function start(data) {
  // No context?
  if (CNS_CONTEXT === "") throw new Error("not configured");

  // Start client
  await client.start();

  // dapr invoke --app-id cns-dapr --method <context>/comment --verb POST --data "Testing"
  var res;

  try {
    // const method =
    //   process.argv[2] ||
    //   CNS_CONTEXT + "/connections/0HT2SKHR1Mi02oVEuAmG/properties"; FOR test.abc
    const method = CNS_CONTEXT + "/connections/yWAf5GI8F4pc6TCeFl5F/properties"; // For skycentrics.oadr3.event.simple

    let far1 = {
      far1: parseFloat(data.value),
    };

    try {
      data = JSON.parse(far1);
    } catch (e) {}
    console.log(far1);

    res = await client.invoker.invoke(
      CNS_DAPR,
      method,
      dapr.HttpMethod.POST,
      far1
    );
  } catch (e) {
    // Failure
    throw new Error("bad request");
  }

  // CNS Dapr error?
  if (res.error !== undefined) throw new Error(res.error);

  // Success
  console.log("Ok");
}

// Start application
// start(data).catch((e) => {
//   console.error("Error:", e.message);
//   process.exit(1);
// });

// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Define a route for "/webhook" that prints the request body to the console
app.post("/webhook", (req, res) => {
  //console.log("Received data:", req.body);
  var reading = req.body.readings[0];
  start(reading);
  res.status(200).send("Data received successfully!\n");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
