import { Elysia } from 'elysia';
import { Server, EVENTS } from '@tus/server';
import { FileStore } from '@tus/file-store';

const UPLOAD_DIR = './uploads';

// 1. Create the TUS Server
const tusServer = new Server({
  path: '/files',
  datastore: new FileStore({ directory: UPLOAD_DIR }),
});

// 2. Attach an event listener for when the upload is finished.
// THIS IS THE EVENT THAT NEVER FIRES.
tusServer.on(EVENTS.POST_FINISH, (req, res, upload) => {
  console.log(`[SUCCESS] Upload finished for ${upload.id}`);
  console.log('Upload metadata:', upload.metadata);
});

// 3. Create the Elysia server
const app = new Elysia();

// 4. Create a handler to pass requests to the TUS server
const tusHandler = async ({ request }) => {
  // Workaround for a bug in generateUrl
  tusServer.options.generateUrl = (req, { id }) => {
    const baseUrl = request.url;
    return `${baseUrl}/${id}`;
  };

  // Pass the request to the TUS server
  return tusServer.handleWeb(request);
};

// 5. Create a route for the client HTML page
app.get('/', () => Bun.file('./index.html'));

// 6. Create the TUS upload routes
app.all('/files', tusHandler);
app.all('/files/*', tusHandler);

// 7. Start the server
app.listen(3000, () => {
  console.log(
    `🦊 Elysia server running at http://${app.server?.hostname}:${app.server?.port}`,
  );
  console.log('Upload client available at the root URL.');
});
