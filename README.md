Basisbenodigdheden
-------------
* [git](https://git-scm.com/download/) source control
* [Visual Studio Code](https://code.visualstudio.com/download) of [VSCodium](https://github.com/vscodium/vscodium/releases/latest) -> typisch ***amd64.deb** bestand.

Alles-in-één commando's:
```bash
sudo apt install git codium curl -y
curl -fsSL https://deno.land/x/install/install.sh|sh
# Volg installatie-instructie:
echo "export DENO_INSTALL=\"$HOME/.deno\"" >> $HOME/.bashrc
echo "export PATH=\"\$DENO_INSTALL/bin:\$PATH\"" >> $HOME/.bashrc
source ~/.bashrc (or logout)
```
(vervang `.bashrc` with `.zshrc` voor MacOS)

---

Deno
----
* [Deno](https://deno.land/manual/getting_started/installation)
* Start Visual Studio Code
  * Open **Extensions** (ctrl+shift+X): en zoek op `Deno` (Identifier: **denoland.vscode-deno**, niet-Canary);
  * klik **Install**
  * Open *Source Control* (ctrl+shift+G);
  * klik op (…) **Clone Repository** en voer in: `https://github.com/xopr/deno_spaceapi`;
  * kies basisprojectmap en vervolgens **Open** en **Yes, I trust the authors**.
  
---

Hello World
-----------
* Open **View**, **Command Palette** (ctrl+shift+P) en typ `deno init`: lint, unstable (beide: ja)
* Herlaad het IDE venster: (ctrl+shift+P), `reload window`
* Open Terminal venster (ctrl+`) en typ de volgende commando's:
```bash
deno init # bij een lege map wordt dit door het eerste init commando verzorgd
deno test
deno run main.ts
```
* Open **main.ts** (ctrl+p) en vervang de code met:
```TypeScript
import { Client } from "https://deno.land/x/mqtt/deno/mod.ts";

const client = new Client( { username: "ackspace", password: "ackspace", url: "mqtt://192.168.1.42" } );
await client.connect();
await client.subscribe( "ackspace/hackspace/spacestate/tele/SENSOR" );

console.log( "Spacestate checker initialized." );

client.on( "message", ( topic, payload ) => {
  console.log( topic, payload );
} );
```
Draai dit.
Draai het nogmaals met: `deno run --allow-net main.ts`

Merk op dat de `payload` binair (`Uint8Array`) en de types `any` zijn.

Vervang de callback met:
```TypeScript 
const decoder = new TextDecoder();
client.on( "message", ( topic: string, payload: Uint8Array ) => {
  const message = decoder.decode( payload );
  console.log( topic, message );
} );
```

Het is JSON, dus parsen maar;
```TypeSCript
  const data = JSON.parse( message );
  console.log( topic, data.Switch1 );
```

Merk op dat we geen code completion/"IntelliSense" hebben; ze zijn van type `any`, dus fixen we het en maken het fancy:
```TypeSCript
  const data = JSON.parse( message ) as { Switch1: "ON" | "OFF" };
  console.log( `Space is ${data.Switch1 === "ON" ? "open" : "closed"}` );
```
Tenslotte fixen we de `topic`-warning door hem te hernoemen naar `_topic`.

Als extra kan men het type op een nette manier implementeren:
```TypeScript
type SpaceState = {
  Switch1: "ON" | "OFF";
}

...

  const data = JSON.parse( message ) as SpaceState;
```

Commit de wijzigingen en ga naar stap 2:
```bash
git add *
git commit -m "Hello SpaceAPI"
git switch part2
```
