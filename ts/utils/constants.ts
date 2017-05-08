import BigNumber = require('bignumber.js');

export const constants = {
    BACKEND_BASE_URL: 'https://api.0xproject.com',
    BITLY_ACCESS_TOKEN: 'ffc4c1a31e5143848fb7c523b39f91b9b213d208',
    BITLY_ENDPOINT: 'https://api-ssl.bitly.com',
    DEFAULT_TOKEN_ICON_URL: '/images/token_icons/default.png',
    ETHER_FAUCET_ENDPOINT: 'http://faucet.0xproject.com/rain',
    FEE_RECIPIENT_ADDRESS: '0x0000000000000000000000000000000000000000',
    INFURA_TESTNET_URL: 'https://kovan.infura.io/T5WSC8cautR4KXyYgsRs',
    MAKER_FEE: new BigNumber(0),
    METAMASK_CHROME_STORE_URL: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    MIST_DOWNLOAD_URL: 'https://github.com/ethereum/mist/releases',
    NULL_ADDRESS: '0x0000000000000000000000000000000000000000',
    ROLLBAR_ACCESS_TOKEN: 'a6619002b51c4464928201e6ea94de65',
    TAKER_FEE: new BigNumber(0),
    TESTNET_NAME: 'Kovan',
    TESTNET_NETWORK_ID: 42,
    iconUrlBySymbol: {
        REP: '/images/token_icons/augur.png',
        DGD: '/images/token_icons/digixdao.png',
        WETH: '/images/token_icons/ether.png',
        MLN: '/images/token_icons/melon.png',
        GNT: '/images/token_icons/golem.png',
        MKR: '/images/token_icons/makerdao.png',
        ZRX: '/images/token_icons/zero_ex.png',
    } as {[symbol: string]: string},
};
