import _ from 'lodash';

import Security from './Security.js';

/**
 * Class tracking market data and time for all relevant securities
 */
class MarketData {
  /**
   * Initialize a new MarketData object
   */
  constructor() {
    this.securities = {};
    this.time = 0;
    this.maxTime = 0;
  }

  /**
   * Adds security with data from Alpaca data
   *
   * @param {string} ticker - the ticker for the security
   * @param {Object[]} data - The array of data points from Alpaca
   */
  addSecurity(ticker, data) {
    // TODO: Convert data to a separate class to ensure it is structured
    this.securities[ticker] = new Security(ticker, data);
    this.maxTime = Math.max(data.length, this.maxTime);
  }

  /**
   * Simulates a minute by mapping the security's information for that minute and updating the
   * current price of all the securities
   *
   * @returns {string} the stringified map of information to simulate coming over a request
   */
  simulateMinute() {
    const validSecurities = _.filter(this.securities, (security) => Boolean(security.data[this.time]));
    const dataMap = _.map(validSecurities, (security) => {
      security.price = security.data[this.time].closePrice;
      return {
        ...security.data[this.time],
        ev: 'AM',
        sym: security.ticker
      }
    });

    this.time++;
    return JSON.stringify(dataMap);
  }

  /**
   * Whether or not there is data for the simulation to continue
   *
   * @type {boolean}
   */
  get hasData() {
    return this.time < this.maxTime;
  }

  /**
   * Gets the current price of a security based on the ticker
   *
   * @param {string} ticker - the ticker for the security
   * @returns {number} the value of the security
   */
  getPrice(ticker) {
    const security = this.securities[ticker];
    return security.price;
  }
}

export default MarketData;
