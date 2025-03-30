import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const imagesApi = createApi({
    reducerPath: 'imagesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://cully-api.vercel.app/api/' }),
    endpoints: (builder) => ({
        getImages: builder.query<{ data: { id: string; filename: string; url: string }[] }, void>({
            query: () => 'images',
        }),
        getFaces: builder.query<{ data: { id: string; xmin: number; ymin: number; xmax: number; ymax: number }[] }, string>({
            query: (imageId) => `images/${imageId}/faces`,
        }),
    }),
});

export const { useGetImagesQuery, useGetFacesQuery } = imagesApi;
