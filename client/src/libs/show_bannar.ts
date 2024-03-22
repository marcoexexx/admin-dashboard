// @ts-nocheck
export default async function show_bannar() {
  try {
    const response = await fetch("/bannar.wasm");
    const wasmBuffer = await response.arrayBuffer();
    const wasmModule = await WebAssembly.instantiate(wasmBuffer, {});
    const exports = wasmModule.instance.exports;

    const get_banner = exports.get_bannar;
    const free_banner = exports.free;

    const getString = (ptr) => {
      const uint8Memory = new Uint8Array(exports.memory.buffer);
      const utf8decoder = new TextDecoder("utf-8");
      const length = uint8Memory.findIndex((element, index) =>
        index === ptr && element === 0
      )
        - ptr;
      const encodedString = uint8Memory.subarray(ptr, ptr + length);
      return utf8decoder.decode(encodedString);
    };

    const bannerPtr = get_banner();
    const banner = getString(bannerPtr);

    console.log(banner.split(".com")[0] + ".com");

    free_banner(bannerPtr);
  } catch (_err) {}
}
