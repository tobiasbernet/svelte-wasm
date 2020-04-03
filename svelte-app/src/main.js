import App from './App.svelte';
import wasm from '../../wasm-game-of-life/Cargo.toml';

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
