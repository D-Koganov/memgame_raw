# memgame_raw
Raw draft of simple memory game: at first one button flashes, then 2, then 3..... Total: 4 buttons. "Show" button starts the game or reminds the current "combination". 

Some parameters can be received from url: 
1. show - to set button flashing timeout
2. maxlev - to set when to restart combination

How: 
..../index.html?show=500&maxlev=5

TODO: 
1. Fix css if you'd feel like it. For now it does what it is supposed to: show big resizable buttons
2. Sound?
3. Think about down-up state. Currently there is a "feature": press mouse down on one button, release it on other -> it counts as last one
