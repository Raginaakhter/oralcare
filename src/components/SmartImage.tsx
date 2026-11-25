import Image, { type ImageProps } from "next/image";
import { assetUrl, isRemoteImage } from "@/lib/api/config";

/**
 * next/image that accepts any backend image URL.
 * Local files are optimised as usual; remote ones (admin-entered URLs, backend
 * /uploads) skip the optimiser so no per-host config is needed.
 */
export function SmartImage({ src, alt, ...rest }: Omit<ImageProps, "src"> & { src?: string | null }) {
  const url = assetUrl(src);
  return <Image src={url} alt={alt} unoptimized={isRemoteImage(url)} {...rest} />;
}
