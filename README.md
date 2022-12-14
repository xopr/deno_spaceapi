We gaan spelen met lampjes!

Bovenaan de file, voeg deze magische import toe:

```TypeScript
import { Artnet } from "https://raw.githubusercontent.com/xopr/deno_artnet/master/lib/module.ts";
```

En onze client initialiseren (het IP adres kan gewijzigd zijn):
```Typescript
const artnet = new Artnet({host:"192.168.1.234", port: 6454, sendAll: true});
const artnetData = new Array<number>(512).fill( 1 );
```
De eerste test:
```TypeScript
void artnet.set(artnetData, 1 );
```

Test je code met:
```bash
deno run --allow-net --unstable main.ts
```

Vervang de `console.log` bij de spacestate check nu in
```TypeScript
    setSpaceLight( data.Switch1 === "ON" );
```

De functie kun je onderaan implementeren:
```TypeScript
function setSpaceLight( on: boolean)
{
  for ( let n = 0; n < artnetData.length; ++n )
  {
    // Select all red or green channels depending on boolean
    artnetData[n] = (n - (on ? 1 : 0)) % 3 ? 1 : 100;
  }

  try
  {
      void artnet.set(artnetData, 1 );
  }
  catch {
    // Pass
  }
}
```
Tada: een SpaceState indicator;
Je bent nu een ART-net expert!

Commit de wijzigingen en ga op zoek naar een andere uitdaging:
```bash
git add *
git commit -m "lempke, wie esj"
```

P.S.
```TypeScript
  for ( let n = 0; n < artnetData.length; n+=3 )
  {
      const [r,g,b] = hslToRgb( range(n, 0, artnetData.length, 0, 100 ) | 0, 100, 50 );
      artnetData[n] = r;
      artnetData[n + 1] = g;
      artnetData[n + 2] = b;
  }
```