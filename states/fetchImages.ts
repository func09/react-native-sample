import { response } from "../fixtures/photos";

export type ImageSource = {
  id: number;
  src: { portrait: string };
};

export const fetchImagesFromPixels = async (
  size = 20
): Promise<ImageSource[]> => {
  return response.photos
    .map((photo) => ({
      id: photo.id,
      src: {
        portrait: photo.src.portrait,
      },
    }))
    .slice(0, size);
};
