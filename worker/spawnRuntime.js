import { execSync } from "child_process";

export async function spawnRuntime({ blobId, objectId }) {
  const port = 30000 + Math.floor(Math.random() * 10000);

  const cmd = `
    docker run -d \
      -e safePort=${port} \
      -e safeBlobId=${blobId || ""} \
      -e safeObjectId=${objectId || ""} \
      -p ${port}:${port} \
      synapse-runtime:latest
  `;

  const containerId = execSync(cmd).toString().trim();

  return {
    containerId,
    endpoint: `http://localhost:${port}`
  };
}
