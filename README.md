Install npm dependencies:

```
cd rest-express
npm install
```

### 2. Create and seed the database

Run the following command to create your SQLite database file.

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database

### 3. Start the REST API server

```
npm run dev
```

The server is now running on `http://localhost:3000`. You can now the API requests, e.g. [`http://localhost:3000`](http://localhost:3000).
