import { Icon } from '@iconify/react';
import { getNfts } from '@src/api/nfts.api';
import Card from '@src/components/common/card';
import { Pagination } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import styles from './styles.module.scss';

export default function ListItem({ onClose, onClick }) {
  const account = useSelector((state) => state.account);

  const ref = useRef(null);

  useOnClickOutside(ref, () => onClose());

  const [isLoading, setIsLoading] = useState(false);
  const [listNFT, setListNFT] = useState({
    nfts: [],
    total: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleOnCloseERC6551 = () => {
    setSelectedTokenBoundAccount();
  };

  const fetchNFTs = async () => {
    if (currentPage === 0) return;
    try {
      setIsLoading(true);
      const { data } = await getNfts({
        page: currentPage,
        owner: account.address,
        size: 5,
        isAvailable: 1,
      });
      setListNFT(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  const handleOnChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleClickItem = (item) => {
    onClick({ address: item.collectionAddress, id: item.tokenId });
    onClose();
  };

  useEffect(() => {
    fetchNFTs();
  }, [account.address, currentPage]);

  return (
    <div className={styles.container}>
      <div className={styles['list-item']} ref={ref}>
        <div className={styles.heading}>
          <span>Choose NFT from your collection</span>
          <Icon icon="material-symbols:close" className={styles['close-btn']} onClick={onClose} />
        </div>
        {isLoading ? (
          <div className="react-loading-item">
            <ReactLoading type="bars" color="#fff" height={100} width={120} />
          </div>
        ) : listNFT.nfts.length > 0 ? (
          <>
            <div className={styles['list-nfts']}>
              {listNFT.nfts.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  action={{
                    text: 'Choose NFT',
                    handle: () => handleClickItem(item),
                  }}
                  handleTokenBoundAccount={() => setSelectedTokenBoundAccount(item)}
                />
              ))}
            </div>
            <div className={styles['paginate-nfts']}>
              <Pagination
                defaultCurrent={currentPage}
                pageSize={5}
                onChange={handleOnChangePage}
                total={listNFT.total}
              />
            </div>
          </>
        ) : (
          <div className={styles['no-data']}>
            <span>No data</span>
          </div>
        )}
      </div>
    </div>
  );
}
