// post.js - CNS Dapr client example
// Copyright 2023 Padi, Inc. All Rights Reserved.

"use strict";

// Imports

const dapr = require("@dapr/dapr");

// Constants

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
async function postEdgex(data) {
  // No context?
  if (CNS_CONTEXT === "") throw new Error("not configured");

  // Start client
  await client.start();

  // dapr invoke --app-id cns-dapr --method <context>/comment --verb POST --data "Testing"
  var res;

  try {
    // const method =
    //   process.argv[2] ||
    //   CNS_CONTEXT + "/connections/0HT2SKHR1Mi02oVEuAmG/properties";
    const method = CNS_CONTEXT + "/connections/0HT2SKHR1Mi02oVEuAmG/properties";
    //var data = process.argv[3] || { far1: "hello" };
    // var data = {
    //   foo1: "helloFFFFFF",
    //   foo2: "Foo22222",
    //   far1: "farrrr1",
    //   far2: "jjjjj",
    //   doesnotexist: "test",
    // };

    console.log(data);

    try {
      data = JSON.parse(data);
    } catch (e) {}

    res = await client.invoker.invoke(
      CNS_DAPR,
      method,
      dapr.HttpMethod.POST,
      data
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
start().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
