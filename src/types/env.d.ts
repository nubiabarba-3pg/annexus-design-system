// Consumer bundlers replace process.env.NODE_ENV at build time; declare only that shape
// instead of pulling Node's global types into a browser library.
declare const process: { env: { NODE_ENV?: string } };
