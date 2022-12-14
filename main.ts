import { Client } from "https://deno.land/x/mqtt/deno/mod.ts";

const client = new Client( { username: "ackspace", password: "ackspace", url: "mqtt://192.168.1.42" } );
await client.connect();
await client.subscribe( "ackspace/hackspace/spacestate/tele/SENSOR" );

console.log( "Spacestate checker initialized." );

const decoder = new TextDecoder();
client.on( "message", ( _topic: string, payload: Uint8Array ) => {
  const message = decoder.decode( payload );
  const data = JSON.parse( message ) as { Switch1: "ON" | "OFF" };
  console.log( `Space is ${data.Switch1 === "ON" ? "open" : "closed"}` );
} );
