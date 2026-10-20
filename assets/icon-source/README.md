# Okazawa Gomi approved icon master

Approved reference: user-supplied white-background trash bin with snowflake (2026-10-21).

`okazawa-approved-master.png` is a production cleanup made using the built-in imagegen tool. The attached reference and exact prompt are in the review ZIP. The basic shape and relative placement were visually compared with the approved image.

Export: `node tools/export-icons.cjs` (requires sharp; current workspace uses its bundled runtime copy).

Exports flatten to opaque white, normalize the high-resolution master to black/white, crop the symbol bounds, uniformly resize the entire group and center it on white. Resizing adds neutral antialiasing at edges, not gradients or decoration. Individual symbol parts are never repositioned by the export script.

Normal icons use 82% maximum symbol width/height. Maskable icons place the farthest symbol pixel at a target radius of 37.5% of the image side, within the 40% safe-zone radius. Tests check the actual exported pixels, including antialiased edges.

Original source images are not needed for runtime or offline caching. Deploy the six exported PNGs together with index.html, manifest.webmanifest and service-worker.js.
