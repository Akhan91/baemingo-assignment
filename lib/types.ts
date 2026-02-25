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

export type OrderItemCardProps = {
  item: MenuItem;
  displayPrice: string;
  onClick: () => void;
};

export type MenuItemsTableProps = {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
};

export type FormState = {
  name: string;
  price: string;
  category: string;
};

export type FormErrors = {
  name?: string;
  price?: string;
  category?: string;
};
