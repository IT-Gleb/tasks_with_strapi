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
  `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;
