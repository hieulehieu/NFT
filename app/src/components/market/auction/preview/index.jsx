/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { CHAIN_ID, DEFAULT_NO_IMAGE, MARKETPLACE_ADDRESS } from '@src/constants';
import { approveERC721, checkApproved, getNftMetadata, parseMetamaskError } from '@src/utils';
import ReactLoading from 'react-loading';
import styles from '../styles.module.scss';
import { useSelector } from 'react-redux';
import { write as marketplaceContractWrite } from '@src/utils/contracts/marketplace';
import { listItem } from '@src/api/marketplace.api';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';

export default function PreviewMarketItem({ marketItem, handleRefresh }) {
  const account = useSelector((state) => state.account);
  const [metadata, setMetadata] = useState({});
  const [marketItemParams, setMarketItemParams] = useState({
    price: 0,
    timeSaleStart: 0,
    timeSaleEnd: 0,
    salePrice: 0,
  });
  const [isSale, setIsSale] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [commitLoading, setCommitLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNftMetadata = async () => {
    try {
      setIsLoading(true);
      setError('');
      setMarketItemParams({
        price: 0,
        timeSaleStart: 0,
        timeSaleEnd: 0,
        salePrice: 0,
      });
      if (marketItem.address && marketItem.id) {
        const nftMetadata = await getNftMetadata(marketItem.address, marketItem.id, CHAIN_ID);
        setMetadata(nftMetadata);
      } else {
        setMetadata({});
      }
      setIsLoading(false);
    } catch (error) {
      if (error?.response.status === 404) {
        setError('Invalid NFT');
      }
      setIsLoading(false);
    }
  };

  const handleMarketItemParamsChange = (e) => {
    setMarketItemParams({
      ...marketItemParams,
      [e.target.name]: e.target.value,
    });

    validateMarketItemParams({
      ...marketItemParams,
      [e.target.name]: e.target.value,
    });
  };

  const validateMarketItemParams = (params) => {
    let paramsError = '';
    if (!isSale) {
      if (params.price == 0) {
        paramsError = 'Price must be greater than 0!';
      } else {
        paramsError = '';
      }
    } else {
      if (params.timeSaleStart >= params.timeSaleEnd) {
        paramsError = 'Time sale end must be after time sale start!';
      } else if (Number(params.salePrice) <= 0 || Number(params.salePrice) >= Number(params.price)) {
        paramsError = 'Sale price must be greater than 0 and less than price!';
      } else {
        paramsError = '';
      }
    }

    setError(paramsError);
    return paramsError;
  };

  const handleSellNft = async () => {
    try {
      if (!marketItem.id || !marketItem.address) {
        console.log('marketItem', marketItem);
        return;
      }

      if (validateMarketItemParams(marketItemParams)) return;

      setCommitLoading(true);
      if (!(await checkApproved(marketItem.id, MARKETPLACE_ADDRESS, marketItem.address))) {
        const tx = await approveERC721(marketItem.id, MARKETPLACE_ADDRESS, marketItem.address);
        await tx.wait();
      }

      await tx.wait();

      toast.success('List NFT successfully. Please waiting for confirmation');
      handleRefresh();
      setCommitLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
      setCommitLoading(false);
    }
  };

  const isDisabledSellButton = () => {
    if (!isSale) {
      return marketItemParams.price == 0 || !marketItemParams.price || error !== '';
    }
    return (
      Object.values(marketItemParams).includes('0') ||
      Object.values(marketItemParams).includes(0) ||
      Object.values(marketItemParams).includes('') ||
      error !== ''
    );
  };

  useEffect(() => {
    fetchNftMetadata();
  }, [marketItem]);

  useEffect(() => {
    if (marketItem) {
      validateMarketItemParams(marketItemParams);
    }
  });

  return (
    <>
      {commitLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <div className={styles['preview-left']}>
        {isLoading ? (
          <div className="react-loading-item mb-60">
            <ReactLoading type="bars" color="#fff" height={100} width={120} />
          </div>
        ) : (
          <img src={metadata?.media?.original_media_url || DEFAULT_NO_IMAGE} />
        )}
      </div>
      <div className={styles['preview-right']}>
        {metadata?.name && !error && <div className={styles.name}>Item: {`${metadata.name} #${marketItem.id}`}</div>}
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles['input-wrap']}>
          <div className={styles['input-label']}>Init Price: </div>
          <div className={styles['input-control']}>
            <input
              type="number"
              placeholder="Price: e.g. 5"
              name="price"
              value={marketItemParams.price}
              onChange={handleMarketItemParamsChange}
            />
            <span>{account.currency}</span>
          </div>
        </div>
        <div className={styles['input-wrap']}>
          <div className={styles['input-label']}></div>
          <div className={styles['input-control']}>
          
          </div>
        </div>
        
          <div className={styles['preview-sale']}>
            <div className={styles['input-wrap']}>
              <div className={styles['input-label']}>Start time: </div>
              <div className={styles['input-control']}>
                <input
                  type="datetime-local"
                  name="timeSaleStart"
                  value={marketItemParams.timeSaleStart}
                  onChange={handleMarketItemParamsChange}
                />
              </div>
            </div>
            <div className={styles['input-wrap']}>
              <div className={styles['input-label']}>Time end: </div>
              <div className={styles['input-control']}>
                <input
                  type="datetime-local"
                  name="timeSaleEnd"
                  value={marketItemParams.timeSaleEnd}
                  onChange={handleMarketItemParamsChange}
                />
              </div>
            </div>
          </div>
        
        <button disabled={isDisabledSellButton()} onClick={handleSellNft}>
          Auction NFT
        </button>
      </div>
    </>
  );
}
