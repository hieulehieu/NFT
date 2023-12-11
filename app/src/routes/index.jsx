import UserLayout from '@src/components/layouts';
import HeaderBanner from '@src/components/layouts/header-banner';
import Marketplace from '@src/components/market/marketplace';
import MarketItemDetails from '@src/components/market/marketplace/details';
import MarketplaceSellNft from '@src/components/market/sell';
import SellingNfts from '@src/components/market/selling-nfts';
import { MARKETPLACE_TABS } from '@src/constants';
import HomePage from '@src/pages';

export const userRoutes = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/marketplace',
        element: (
          <HeaderBanner
            title="Marketplace"
            description="Sell your NFT on Marketplace."
            right={false}
            tabs={MARKETPLACE_TABS}
          />
        ),
        children: [
          {
            path: '/marketplace/nfts',
            element: <Marketplace />,
          },
          {
            path: '/marketplace/selling-nfts',
            element: <SellingNfts />,
          },
        ],
      },
      {
        path: '/marketplace',
        element: (
          <HeaderBanner
            title="Create New NFT"
            description="Single edition on Mumbai"
            right={false}
            tabs={MARKETPLACE_TABS}
          />
        ),
        children: [
          {
            path: '/marketplace/sell',
            element: <MarketplaceSellNft />,
          },
        ],
      },
      {
        path: 'marketplace/assets/:id',
        element: <MarketItemDetails />,
      },
    ],
  },
];
