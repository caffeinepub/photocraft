import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useStorage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File): Promise<{ blobId: string; url: string }> => {
      if (!actor) throw new Error("Not authenticated");
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const config = await loadConfig();
        const agentOptions = identity ? { identity } : {};
        const agent = await HttpAgent.create({
          ...agentOptions,
          host: config.backend_host,
        });

        const storageClient = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        );

        const bytes = new Uint8Array(await file.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (pct) => {
          setUploadProgress(pct);
        });

        const url = await storageClient.getDirectURL(hash);
        return { blobId: hash, url };
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [actor, identity],
  );

  const getFileUrl = useCallback(
    async (blobId: string): Promise<string> => {
      const config = await loadConfig();
      const agentOptions = identity ? { identity } : {};
      const agent = await HttpAgent.create({
        ...agentOptions,
        host: config.backend_host,
      });

      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      return storageClient.getDirectURL(blobId);
    },
    [identity],
  );

  return { uploadFile, getFileUrl, uploadProgress, isUploading };
}
