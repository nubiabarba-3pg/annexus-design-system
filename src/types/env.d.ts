// Consumer bundlers replace process.env.NODE_ENV at build time; declare only that shape
// instead of pulling Node's global types into a browser library.
// Delete this file if @types/node is ever installed — both declare `process` and typecheck fails.
declare const process: { env: { NODE_ENV?: string } };
