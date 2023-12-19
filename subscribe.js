// subscribe.js - CNS Dapr client example
// Copyright 2023 Padi, Inc. All Rights Reserved.

"use strict";

// Imports

const dapr = require("@dapr/dapr");

// Constants

const SERVER_HOST = process.env.CNS_SERVER_HOST || "localhost";
const SERVER_PORT = process.env.CNS_SERVER_PORT || "3100";

const DAPR_HOST = process.env.CNS_DAPR_HOST || "localhost";
const DAPR_PORT = process.env.CNS_DAPR_PORT || "3500";

const CNS_PUBSUB = process.env.CNS_PUBSUB || "cns-pubsub";
const CNS_CONTEXT = process.env.CNS_CONTEXT || "Uud1c8RS2YQTqQ3u47eg";

// Dapr server

const server = new dapr.DaprServer({
  serverHost: SERVER_HOST,
  serverPort: SERVER_PORT,
  clientOptions: {
    daprHost: DAPR_HOST,
    daprPort: DAPR_PORT,
  },
});

// Client application
async function start() {
  // No context?
  if (CNS_CONTEXT === "") throw new Error("not configured");

  // Subscribe to topic
  const topic = process.argv[2] || CNS_CONTEXT;

  server.pubsub.subscribe(CNS_PUBSUB, topic, (data) => {
    console.log(topic, "=", JSON.stringify(data, null, 2));
  });

  // Start server
  await server.start();
}

// Start application
start().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
