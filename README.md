# svelte-wasm

Svelte-wasm is an example project that how WebAssembly and Svelte could work
together.

This example project uses:
- [Svelte](https://svelte.dev/) as frontend "Framework".
- [RollupJs](https://rollupjs.org/guide/en/) as module bundler.
- [wasm-rollup-plugin](https://github.com/wasm-tool/rollup-plugin-rust) the perfect Helper to integrate your Rust code into your js env.
- [Rust](https://www.rust-lang.org/)
- [wasm-pack](https://github.com/rustwasm/wasm-pack) awesome Rust WebAssembly Generator.

Is for: The main focus of this project is to make an integration example of WebAssembly (Rust) and Svelte.
Is not for: This project is neither a coding example from Rust nor from Svelte.

## Basics setup
Svelte: I used the quick [tutorial](https://svelte.dev/blog/the-easiest-way-to-get-started) - straight forward.

Rust-Wasm: I used the `hello-world` example from this great [tutorial](https://rustwalsm.github.io/docs/book/game-of-life/hello-world.html).

Project structure:
```
svelte-wasm
├── svelte-app
└── wasm-game-of-life
```

## Setup wasm
1. Install the [rollup-plugin-rust](https://github.com/wasm-tool/rollup-plugin-rust) plugin.
2. Setup the plugin in your `rollup.config.js`
   ```js
   // ...
   import rust from "@wasm-tool/rollup-plugin-rust";

   export default [{
     // ...

     plugins: [
       // ...

       // Add the configuration for your wasm-tool plugins
       // The generated .wasm file is placed in the /build/ folder.
       // To tell the server where to fetch the .wasm file you have to specify
       // the path otherwise you get a 404 error (.wasm file not found).
       rust({
        verbose: true,
        serverPath: "/build/"
      }),
     ]
   }]
   ```
3. Access your wasm `greet()` function in your Svelte js code.
   ```rust
     //wasm-game-of-life/src/lib.rs
     mod utils;

    use wasm_bindgen::prelude::*;

    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
    // allocator.
    #[cfg(feature = "wee_alloc")]
    #[global_allocator]
    static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

    #[wasm_bindgen]
    pub fn greet() -> String {
        "Hello, wasm-game-of-life!".into()
   }
   ```

   ```js
   // svelte-app/src/main.js
   import App from './App.svelte';
   // Load the .toml file of your Rust project.
   // The wasm-plugin runs `wasm-pack build` and cpoies the output into
   // `svelte-app/target` directory.
   // The `.wasm` file is located in the `svelte-app/public/build` dir.
   import wasm from '../../wasm-game-of-life/Cargo.toml';

   // WebAssembly files must be loaded async.
   const init = async () => {
       const gameOfLife = await wasm();

       const app = new App({
           target: document.body,
           props: {
             // https://svelte.dev/docs#Creating_a_component
             greet: gameOfLife.greet()
           }
       });
   };

   init();
   ```
4. Start the server `npm run dev`.
   The output should look something like this:
   ```bash
   Your application is ready~! 🚀

   ➡ Port 5000 is taken; using 40179 instead

   - Local:      http://localhost:40179
 
   ────────────────── LOGS ──────────────────

   [23:02:30] 200 ─ 5.79ms ─ /
   [23:02:30] 200 ─ 1.51ms ─ /global.css
   [23:02:30] 200 ─ 2.81ms ─ /build/bundle.css
   [23:02:30] 200 ─ 3.40ms ─ /build/bundle.js
   [23:02:31] 200 ─ 2.04ms ─ /build/wasm-game-of-life.wasm <-- The defined build path in your rollup.config.js file.
   [23:02:31] 200 ─ 4.86ms ─ /build/bundle.css.map
   [23:02:31] 200 ─ 7.84ms ─ /build/bundle.js.map
   [23:02:31] 200 ─ 1.20ms ─ /favicon.png
   ```
