import { Client } from "https://deno.land/x/mqtt/deno/mod.ts";
import { decodePayload, interfaces, is, PowerType, SpaceStateType, TemperatureType } from "./SpaceApi.ts";

const client = new Client( { username: "ackspace", password: "ackspace", url: "mqtt://192.168.1.42" } );
await client.connect();
await client.subscribe( "#" );

console.log( "Spacestate checker initialized." );

client.on( "message", ( topic: keyof interfaces, payload: Uint8Array ) => {
  const data = decodePayload( topic, payload );
  if ( !data )
    return;
  if ( is( SpaceStateType, data ) )
    console.log( `Space is ${data.Switch1 === "ON" ? "open" : "closed"}` );
  else if ( is( TemperatureType, data ) )
    console.log( `Temperature is ${data["DS18B20-1"].Temperature}` );
  else if ( is( PowerType, data ) )
    console.log( `Power is ${data.ENERGY.Power}: ${data.Switch1}` );
  else
    console.log( `unknown topic: ${data.topic}`);
} );
