import { createRouteHandler } from "uploadthing/next";
import { uploadFileRouter } from "@/lib/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: uploadFileRouter,
});