// Servidor HTTP local para servir archivos estáticos desde DocumentDir
import StaticServer from 'react-native-static-server';
import RNFetchBlob from 'react-native-blob-util';

let server: StaticServer | null = null;

export async function startLocalServer(): Promise<string | null> {
  if (server) {
    return server.url;
  }
  const port = 8089;
  const root = RNFetchBlob.fs.dirs.DocumentDir;
  server = new StaticServer(port, root, { localOnly: true });
  try {
    const url = await server.start();
    return url;
  } catch (e) {
    return null;
  }
}

export function stopLocalServer() {
  if (server) {
    server.stop();
    server = null;
  }
}
