# TUS Server + Elysia.js integration not working

This project provides a minimal reproducible example of an issue where the `@tus/server` does not fire the `POST_FINISH` event when used with `@tus/file-store` in a `bun` + `elysia` environment.

## The Bug

The server correctly handles the TUS `POST` and `PATCH` requests, creating a file and writing the uploaded chunks to it. The client-side upload successfully reaches 100% and the `onSuccess` callback is fired.

However, on the server-side, the `tusServer.on(EVENTS.POST_FINISH, ...)` event listener is never called, preventing any post-processing logic from running.

## How to Reproduce

1.  **Install Dependencies:**
    ```bash
    bun install
    ```

2.  **Run the Server:**
    ```bash
    bun start
    ```
    The server will be running at `http://localhost:3000`.

3.  **Open the Client:**
    Open your web browser and navigate to `http://localhost:3000`.

4.  **Upload a File:**
    Select any file using the file input and the upload will start automatically.

## Expected Behavior

When the upload completes, you should see the following message in the **server-side console logs**:

```
[SUCCESS] Upload finished for <upload-id>
```

## Actual Behavior

The upload completes successfully on the client, but the `[SUCCESS]` message never appears in the server logs, indicating the `POST_FINISH` event was not emitted.
