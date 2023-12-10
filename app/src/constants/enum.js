export const OfferStatus = {
  OPENING: '0',
  FILLED: '1',
  REPAID: '2',
  LIQUIDATED: '3',
  EXPIRED: '4',
};

export const OrderStatus = {
  OPENING: 0,
  FILLED: 1,
  CANCELLED: 2,
  REPAID: 3,
  LIQUIDATED: 4,
  REJECTED: 5,
};

export const RequestStatus = {
  OPENING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  FILLED: 3,
};

export const MarketItemStatus = {
  PENDING: '0',
  OPENING: '1',
  SOLD: '2',
  CLOSED: '3',
};

export const FormType = {
  VIEW: 'View',
  EDIT: 'Edit',
};

export const MarketItemStatusToText = {
  [MarketItemStatus.PENDING]: 'List',
  [MarketItemStatus.OPENING]: 'List',
  [MarketItemStatus.SOLD]: 'Sale',
  [MarketItemStatus.CLOSED]: 'Close',
};
