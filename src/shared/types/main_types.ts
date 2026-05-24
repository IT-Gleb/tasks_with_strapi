export type TPageSeo = {
  data: {
    id: number;
    documentId: string;
    title: string;
    description: string;
    author: string;
    creator: string;
    createdAt: number | string;
    updatedAt: number | string;
    publishedAt: number | string;
  };
  meta: Object;
};

export type TDateTimeISOString =
  `${number}-${number | string}-${number | string}T${number}:${number}:${number}.${number}Z`;

export type TDateISOString = `${number}-${number | string}-${number | string}`;
