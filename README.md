# Create CERTS

In this folder, write this in your terminal:

```bash
openssl genrsa -out server-key.pem 2048
```

```bash
openssl req -new -key server-key.pem -out server.csr
```

```bash
openssl x509 -req -days 365 -in server.csr -signkey server-key.pem -out server-cert.pem
```

## CA Cert

The CA cert depends on each country or corporation, but for this example i will use the one from Spain:

[Spain's government root certificate](https://www.sede.fnmt.gob.es/descargas/certificados-raiz-de-la-fnmt)

Is the first link to download it. Then move it to this folder and rename it to `server-ca.cer`.

## Launch Project

```bash
npm install
npm run dev
```

or with pnpm:

```bash
pnpm install
pnpm dev
```

or with yarn:

```bash
yarn install
yarn dev
```

Now open your browser at [localhost:4443](https://localhost:4443). Very important top confirm tha the url has the `https`, if not, write it manually.
