We gaan op alle topics subscriben!

```TypeScript
await client.subscribe( "#" );
```

Vervolgens laten we de bibliotheek onze data decoderen (in de `on( "message"... )` callback):
Owja, haal het liggend streepje bij `_topic` en de `decoder` weg.

```TypeScript
const data = decodePayload( topic, payload );
  if ( !data )
    return;
```
Merk op dat `decodePayload` niet herkend wordt; aanwijzen en check met "quick fix" (of met de cursor erop staan en **ctrl+.** ): **Add missing function declaration 'decodePayload'** VSCode weet het even niet, dus we voegen het handmatig toe bovenin de file:
```TypeScript
import { decodePayload } from "./SpaceApi.ts";
```

Nu doet `topic` een beetje raar: verander
```TypeScript
topic: string
```
in
```TypeScript
topic: keyof interfaces
```
En doe een quick fix op `interfaces`: **Update import from './SpaceApi.ts**


Nu hebben we een generiek type (`TasmotaPayload`):
Wijs maar over de `data.Switch1` en zie dat het type `SwitchState | undefined` is.

Ook is er code completion: typ maar `data.` en zie de code completion zijn werk doen (kies bijvoorbeeld `ENERGY?` en zie dat het veranderd in `data?.ENERGY`).

We gaan type guard magic toepassen:
```TypeScript
    if ( is( SpaceStateType, data ) )
      console.log( `Space is ${data.Switch1 === "ON" ? "open" : "closed"}` );
```
Doe een quick fix op `is` en `SpaceStateType`.
Wijs nu opnieuw `Switch1` aan en zie dat het enkel `SwitchState` is geworden: type guard actief!

En nu voor de overige 2 types:
* `TemperatureType` -> `["DS18B20-1"].Temperature` (het streepje maakt het speciaal)
* `PowerType` -> `ENERGY.Power` en `Switch`

Test je code met:
```bash
deno run --allow-net main.ts
```

Je bent nu een TypeScript expert!

Commit de wijzigingen en ga naar stap 3:
```bash
git add *
git commit -m "I CAN HAZ TYPESCRIPT"
git switch part3
```
