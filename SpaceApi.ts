// Instance used for decoding the MQTT payload
const decoder = new TextDecoder();

/** The possible Tasmota switch states */
type SwitchState = "ON" | "OFF"

/** The Tasmota Onewire temperature data */
type OneWire = {
  Id: string;
  Temperature: number;
}

/** All possible topics implemented */
type TopicTypes = keyof interfaces

/**
 * Tasmota payload with all the possible fields as optional
 */
export interface TasmotaPayload
{
    topic: TopicTypes;
    Time: string;
    Switch1?: SwitchState;
    ENERGY?:
    {
        TotalStartTime: string;
        Total: number;
        Yesterday: number;
        Today: number;
        Period: number;
        Power: number;
        ApparentPower: number;
        ReactivePower: number;
        Factor: number;
        Voltage: number;
        Current: number;
    };
    "DS18B20-1"?: OneWire;
    "DS18B20-2"?: OneWire;
    "DS18B20-3"?: OneWire;
    TempUnit?: "C";
}

// This is where the first half of the magic happens:
// It uses the TasmotaPayload interface to pick (and make them non-optional) fields used within the topic's payload.
// Later, this will be used to do type guarding which does our code completion/"IntelliSense"

const SpaceStateTopic = "ackspace/hackspace/spacestate/tele/SENSOR";
/** The space state interface */
export type SpaceState = Required<Pick<TasmotaPayload & { "topic": typeof SpaceStateTopic }, "topic" | "Time" | "Switch1">>;
/** The space state type to use in type guard function */
export const SpaceStateType = { topic: SpaceStateTopic } as SpaceState;

const TemperatureTopic = "ackspace/stackspace/temperature/tele/SENSOR";
/** The temperature interface */
export type Temperature = Required<Pick<TasmotaPayload & { "topic": typeof TemperatureTopic }, "topic" | "Time" | "DS18B20-1" | "DS18B20-2" | "DS18B20-3">>;
/** The temperature type to use in type guard function */
export const TemperatureType = { topic: TemperatureTopic } as Temperature;

const PowerTopic = "ackspace/hackspace/hackcorner/tele/SENSOR";
/** The power interface */
export type Power = Required<Pick<TasmotaPayload & { "topic": typeof PowerTopic }, "topic" | "Time" | "ENERGY" | "Switch1" >>;
/** The power type to use in type guard function */
export const PowerType = { topic: PowerTopic } as Power;

/** SpaceApi topics tied to their interfaces */
export type interfaces = {
  [SpaceStateTopic]: SpaceState;
  [TemperatureTopic]: Temperature;
  [PowerTopic]: Power;
}

// Here is part two of the magic: type guard.
// It needs to do a non-type (i.e. "javascript" check in order to infer its correct type within typescript)

/**
 * Generic SpaceApi type guard function
 * @param spaceApiType The SpaceApi type to compare the payload with
 * @param payload The payload containing the encoded SpaceApi data
 * @returns true if the type matches, inferring the type within its scope
 */
export function is<T extends TasmotaPayload>( spaceApiType: T, payload: TasmotaPayload ): payload is T
{
  return payload.topic === spaceApiType["topic"];
}

/**
 * Decode the Tasmota payload into SpaceApi interface
 * @param topic The topic on which the payload is received
 * @param payload The payload containing the encoded SpaceApi data
 * @returns The SpaceApi data decoded as TasmotaPayload
 */
export function decodePayload<T = TasmotaPayload>(topic: keyof interfaces, payload: Uint8Array ): T | undefined
{
  try
  {
    const data = JSON.parse( decoder.decode( payload ) );
    data.topic = topic;
    return data;
  }
  catch
  {
    return undefined;
  }
}
