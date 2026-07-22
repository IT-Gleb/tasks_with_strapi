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

//---Shop types -------------------
export type TGoodItemPicture = {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  mime: string;
  ext: string;
  size: number;
  width: number;
  height: number;
};

export type TGoodItem = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  initialprice: number;
  discount: number;
  price: number;
  isactive: boolean;
  picture: TGoodItemPicture[];
};

export type TBasketItem = Pick<TGoodItem, "documentId" | "title" | "price"> & {
  count: number;
  inOrder?: boolean;
};

export type TCategories = {
  id: number;
  title: string;
  goods: TGoodItem[];
};

export type TShopPageSEO = {
  data: {
    id: number;
    title: string;
    description: string;
    author: string;
    creator: string;
  };
};

//------Hero Component
export type THeroImage = {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
};

export type THero = {
  data: {
    id: number;
    HelloText: string;
    topImages: THeroImage[];
    bottomImages: THeroImage[];
  };
};

export type THeroError = {
  error: boolean;
  message: string;
};

export type TOrderStatus =
  | "created"
  | "delivered"
  | "in-work"
  | "cancelled"
  | "success";

export type TOrder = {
  id: string;
  title: string | null;
  createdAt: Date | number;
  updatedAt: Date | number;
  price: number;
  status: TOrderStatus;
  items: TBasketItem[];
};
