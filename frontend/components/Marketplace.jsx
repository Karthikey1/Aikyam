import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from './Marketplace.module.css';

// Mock data generators
const generatePriceData = () => {
  const basePrice = Math.random() * 1000 + 2000;
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    price: basePrice + Math.sin(i) * 100 + Math.random() * 50
  }));
};

const generateOrderBook = () => ({
  buy: Array.from({ length: 10 }, (_, i) => ({
    price: 2150 - i * 5,
    quantity: Math.floor(Math.random() * 1000) + 500
  })),
  sell: Array.from({ length: 10 }, (_, i) => ({
    price: 2150 + i * 5,
    quantity: Math.floor(Math.random() * 1000) + 500
  }))
});

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('market');
  const [orderType, setOrderType] = useState('limit');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [positions, setPositions] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [marketData, setMarketData] = useState(generatePriceData());
  const [orderBook, setOrderBook] = useState(generateOrderBook());
  const [selectedCrop, setSelectedCrop] = useState('WHEAT');
  const [balance] = useState(1000000);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => [...prev.slice(1), {
        time: new Date().toLocaleTimeString(),
        price: prev[prev.length - 1].price + (Math.random() - 0.5) * 10
      }]);
      setOrderBook(generateOrderBook());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const executeOrder = (side) => {
    if (!quantity || (orderType === 'limit' && !price)) return;

    const newOrder = {
      id: Date.now(),
      crop: selectedCrop,
      type: side,
      quantity: parseInt(quantity),
      price: orderType === 'market' ? marketData[marketData.length - 1].price : parseFloat(price),
      status: 'filled',
      timestamp: new Date().toLocaleString()
    };

    setOrderHistory(prev => [newOrder, ...prev]);
    setPositions(prev => {
      const existing = prev.find(p => p.crop === selectedCrop);
      if (existing) {
        return prev.map(p => p.crop === selectedCrop ? {
          ...p,
          quantity: side === 'buy' ? p.quantity + newOrder.quantity : p.quantity - newOrder.quantity,
          pnl: (newOrder.price - p.avgPrice) * (side === 'buy' ? 1 : -1) * newOrder.quantity
        } : p);
      }
      return [...prev, {
        crop: selectedCrop,
        quantity: newOrder.quantity,
        avgPrice: newOrder.price,
        ltp: newOrder.price,
        pnl: 0
      }];
    });

    setQuantity('');
    setPrice('');
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.branding}>
          <h1>AgriTrade Pro</h1>
          <div className={styles.marketStatus}>
            <span className={styles.liveDot}></span>
            LIVE
          </div>
        </div>
        
        <div className={styles.accountInfo}>
          <div className={styles.balance}>
            <span>Available Balance:</span>
            <span>₹{balance.toLocaleString()}</span>
          </div>
          <button className={styles.profileButton}>👤</button>
        </div>
      </header>

      {/* Main Trading Interface */}
      <div className={styles.mainGrid}>
        {/* Chart Section */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.instrumentInfo}>
              <h2>{selectedCrop}</h2>
              <div className={styles.priceDisplay}>
                <span className={styles.lastPrice}>
                  ₹{marketData[marketData.length - 1]?.price.toFixed(2)}
                </span>
                <span className={styles.priceChange}>
                  (+{((marketData[marketData.length - 1]?.price - marketData[0]?.price) / marketData[0]?.price * 100).toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className={styles.chartControls}>
              <button>1D</button>
              <button>1W</button>
              <button>1M</button>
              <button>1Y</button>
            </div>
          </div>
          
          <LineChart
            width={800}
            height={400}
            data={marketData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
              labelStyle={{ color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#00c853"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </div>

        {/* Order Entry */}
        <div className={styles.orderPanel}>
          <div className={styles.orderTabs}>
            {['market', 'limit', 'sl', 'slm'].map(type => (
              <button
                key={type}
                className={`${styles.orderTab} ${orderType === type ? styles.active : ''}`}
                onClick={() => setOrderType(type)}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <div className={styles.orderForm}>
            <div className={styles.inputGroup}>
              <label>Quantity (Quintal)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                step="10"
              />
            </div>

            {['limit', 'sl', 'slm'].includes(orderType) && (
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
              <button 
                className={styles.buyButton}
                onClick={() => executeOrder('buy')}
              >
                BUY
              </button>
              <button 
                className={styles.sellButton}
                onClick={() => executeOrder('sell')}
              >
                SELL
              </button>
            </div>
          </div>

          {/* Position Summary */}
          <div className={styles.positionSummary}>
            <h3>Your Positions</h3>
            {positions.map(pos => (
              <div key={pos.crop} className={styles.positionItem}>
                <span>{pos.crop}</span>
                <span>{pos.quantity} Q</span>
                <span className={pos.pnl >= 0 ? styles.positive : styles.negative}>
                  ₹{pos.pnl.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Book */}
        <div className={styles.orderBook}>
          <h3>Order Book</h3>
          <div className={styles.orderBookGrid}>
            <div className={styles.buyOrders}>
              {orderBook.buy.map((order, i) => (
                <div key={`buy-${i}`} className={styles.orderRow}>
                  <span className={styles.buyText}>{order.quantity}</span>
                  <span className={styles.buyPrice}>₹{order.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className={styles.spread}>
              Spread: ₹{(orderBook.sell[0].price - orderBook.buy[0].price).toFixed(2)}
            </div>
            <div className={styles.sellOrders}>
              {orderBook.sell.map((order, i) => (
                <div key={`sell-${i}`} className={styles.orderRow}>
                  <span className={styles.sellPrice}>₹{order.price.toFixed(2)}</span>
                  <span className={styles.sellText}>{order.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className={styles.orderHistory}>
          <h3>Order History</h3>
          <div className={styles.historyTable}>
            <div className={styles.tableHeader}>
              <span>Time</span>
              <span>Type</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Status</span>
            </div>
            {orderHistory.map(order => (
              <div key={order.id} className={styles.tableRow}>
                <span>{order.timestamp}</span>
                <span className={order.type === 'buy' ? styles.buyText : styles.sellText}>
                  {order.type.toUpperCase()}
                </span>
                <span>{order.quantity}</span>
                <span>₹{order.price.toFixed(2)}</span>
                <span className={styles.statusFilled}>{order.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;