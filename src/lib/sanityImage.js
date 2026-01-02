import imageUrlBuilder from "@sanity/image-url";
import { sanity } from "./sanityClient";

const builder = imageUrlBuilder(sanity);

export function urlFor(source) {
  return builder.image(source);
}
