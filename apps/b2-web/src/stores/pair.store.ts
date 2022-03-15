import { writable } from "svelte/store";

export const selectedPairStore = writable();

export const selectedPairsStore = writable([]);
