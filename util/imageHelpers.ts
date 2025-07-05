/**
 * Utility functions for handling images in the product app
 */

/**
 * Checks if an image source is a valid URI string
 * @param source - The image source to check
 * @returns boolean indicating if it's a valid URI
 */
export const isImageUri = (source: string | number): source is string => {
  return (
    typeof source === "string" &&
    (source.startsWith("http://") ||
      source.startsWith("https://") ||
      source.startsWith("file://") ||
      source.startsWith("content://"))
  );
};

/**
 * Gets the display source for an image, handling both URI strings and require() results
 * @param imageSource - The image source (string URI or require() result)
 * @returns The appropriate source object for Image component
 */
export const getImageSource = (imageSource: string | number) => {
  if (isImageUri(imageSource as string)) {
    return { uri: imageSource as string };
  }
  return imageSource as number; // require() result
};

/**
 * Default product image when no image is provided
 */
export const DEFAULT_PRODUCT_IMAGE = require("@/assets/images/products/default.jpeg");
