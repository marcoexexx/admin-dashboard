// @ts-nocheck
import fs from 'fs'

function getMemoryString(memory, ptr) {
  const uint8Memory = new Uint8Array(memory.buffer);
  const utf8decoder = new TextDecoder('utf-8');
  const length = uint8Memory.findIndex((element, index) => index === ptr && element === 0) - ptr;
  const encodedString = uint8Memory.subarray(ptr, ptr + length);
  return utf8decoder.decode(encodedString);
}

export default function show_bannar() {
  try {
    const libBuf = fs.readFileSync("public/upload/excels/bannar.wasm")
    const typedArray = new Uint8Array(libBuf)

    WebAssembly.instantiate(typedArray, {})
      .then(res => res.instance.exports)
      .then(({get_bannar, free, memory}) => {
        const bannar_ptr = get_bannar()
        const bannar = getMemoryString(memory, bannar_ptr)
        console.log(bannar)
        free(bannar_ptr)
      })
      .catch(console.error)
  } catch (_) { }
}
