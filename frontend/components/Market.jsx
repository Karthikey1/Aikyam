import { useState } from 'react';
import styles from './Market.css';

const Market = () => {
  const [activeTab, setActiveTab] = useState('market');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  // Mock data
  const marketDepth = {
    buy: [
      { price: 2150, quantity: 150 },
      { price: 2145, quantity: 75 },
      { price: 2140, quantity: 200 },
    ],
    sell: [
      { price: 2155, quantity: 120 },
      { price: 2160, quantity: 90 },
      { price: 2165, quantity: 150 },
    ],
  };

  const positions = [
    { crop: 'Wheat', qty: 50, ltp: 2150, pnl: +2500 },
    { crop: 'Rice', qty: 30, ltp: 2850, pnl: -1500 },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Search crop..." />
        </div>
        <div className={styles.quickActions}>
          <button>Limit</button>
          <button>Market</button>
          <button>SL</button>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.gridContainer}>
        {/* Chart Section */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <span>WHEAT</span>
            <div className={styles.priceInfo}>
              <span className={styles.price}>2150.00</span>
              <span className={styles.changePositive}>+2.50 (0.12%)</span>
            </div>
          </div>
          <div className={styles.chartPlaceholder}>
            {/* Add chart library here later */}
            <div className={styles.chartMock}>Price Chart</div>
          </div>
        </div>

        {/* Order Panel */}
        <div className={styles.orderPanel}>
          <div className={styles.orderTabs}>
            <button 
              className={activeTab === 'market' ? styles.active : ''}
              onClick={() => setActiveTab('market')}
            >
              Market
            </button>
            <button 
              className={activeTab === 'limit' ? styles.active : ''}
              onClick={() => setActiveTab('limit')}
            >
              Limit
            </button>
          </div>

          <div className={styles.orderForm}>
            <div className={styles.inputGroup}>
              <label>Quantity (Quintal)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {activeTab === 'limit' && (
              <div className={styles.inputGroup}>
                <label>Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}

            <div className={styles.orderButtons}>
              <button className={styles.buyButton}>Buy</button>
              <button className={styles.sellButton}>Sell</button>
            </div>
          </div>
        </div>

        {/* Order Book */}
        <div className={styles.orderBook}>
          <h3>Order Book</h3>
          <div className={styles.orderList}>
            {marketDepth.buy.map((order, index) => (
              <div key={`buy-${index}`} className={styles.buyOrder}>
                <span>{order.quantity}</span>
                <span className={styles.buyPrice}>{order.price}</span>
              </div>
            ))}
            <div className={styles.divider}></div>
            {marketDepth.sell.map((order, index) => (
              <div key={`sell-${index}`} className={styles.sellOrder}>
                <span className={styles.sellPrice}>{order.price}</span>
                <span>{order.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Positions */}
        <div className={styles.positions}>
          <h3>Positions</h3>
          <div className={styles.positionTable}>
            {positions.map((position, index) => (
              <div key={index} className={styles.positionRow}>
                <span>{position.crop}</span>
                <span>{position.qty}</span>
                <span>{position.ltp}</span>
                <span className={position.pnl > 0 ? styles.positive : styles.negative}>
                  {position.pnl > 0 ? `+₹${position.pnl}` : `-₹${Math.abs(position.pnl)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;