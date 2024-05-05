import linkIcon from "cryptocurrency-icons/svg/color/link.svg";
import usdcIcon from "cryptocurrency-icons/svg/color/usdc.svg";
import usdtIcon from "cryptocurrency-icons/svg/color/usdt.svg";
import daiIcon from "cryptocurrency-icons/svg/color/dai.svg";
import aaveIcon from "cryptocurrency-icons/svg/color/aave.svg";
import wBtcIcon from "cryptocurrency-icons/svg/color/wbtc.svg";
import wEthIcon from "cryptocurrency-icons/svg/color/eth.svg";
import eurIcon from "cryptocurrency-icons/svg/color/eur.svg";
import genericCryptoIcon from "cryptocurrency-icons/svg/color/generic.svg";

import ghoIcon from "./assets/gho.svg";
import eursIcons from "./assets/eurs.svg";

const CryptoIconMap: { [key: string]: string } = {
  LINK: linkIcon,
  USDC: usdcIcon,
  USDT: usdtIcon,
  DAI: daiIcon,
  AAVE: aaveIcon,
  WBTC: wBtcIcon,
  WETH: wEthIcon,
  EUR: eurIcon,
  GHO: ghoIcon,
  EURS: eursIcons,
};

export { genericCryptoIcon, CryptoIconMap };
