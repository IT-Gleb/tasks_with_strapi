export type TPageMeta = {
  pagination: {
    total?: number;
    page?: number;
    pageSize?: number;
    pageCount?: number;
    limit?: number;
  };
};
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
  meta: TPageMeta;
};

export type TDateTimeISOString =
  `${number}-${number | string}-${number | string}T${number}:${number}:${number}.${number}Z`;

export type TDateISOString = `${number}-${number | string}-${number | string}`;

export type TTodo = {
  id: number;
  documentId: string;
  title: string;
  isCompleted: boolean;
  updated: number | Date;
  order: number;
  createdAt: number | Date;
  updatedAt: number | Date;
  publishedAt: number | Date;
};

export type TTodosData = {
  data: TTodo[];
  meta: TPageMeta;
};

export type TTodosMax = {
  data: {
    id: number;
    documentId: string;
    order: number;
  }[];
  meta: TPageMeta;
};

export type TTodosDates = {
  data: {
    id: number;
    documentId: string;
    updated: number | Date;
  }[];
  meta: TPageMeta;
};
