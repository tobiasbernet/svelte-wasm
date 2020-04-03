import App from './App.svelte';
import wasm from '../../wasm-game-of-life/Cargo.toml';

const init = async () => {
    const wasmer = await wasm();
    wasmer.greet();

    const app = new App({
        target: document.body
    });

};

init();
