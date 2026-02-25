export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export type OrderLine = {
  id: string;
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};


