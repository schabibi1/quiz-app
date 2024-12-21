import { NhostClient } from "@nhost/nextjs";

export const nhost = new NhostClient({
  subdomain: "subdomain",
  region: "region"
});