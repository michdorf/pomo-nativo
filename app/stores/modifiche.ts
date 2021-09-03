import {writable} from "svelte/store";

let modifNonSalvate = writable<boolean>(false);
export default modifNonSalvate;
