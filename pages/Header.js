import cx from 'classnames';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import settingsBoxIcon from '../../../../assets/images/settings/settings-box-icon.svg';
import impressionIcon from '../../../../assets/images/general-settings/impression.svg';
import premiumIcon from '../../../../assets/images/premium.svg';
import { isMainNet } from '../../../../utils/BlockchainServiceProviders';
import { thousandSeperater } from '../../../../utils/Currency';
import { formatBytes } from '../../../../utils/Currency';
import { dataPerMASQ, premiumTokenAmt } from '../../../../configs/constants';
import OverlayTrigger from '../../../Common/Overlay';
import './Header.scss';
import { FrontSide } from 'three';

const StatusItem = ({ status, target }) => (
  <div className="settings-header__status d-flex justify-content-between align-items-center gap-2 w-100">
    <span className={cx({ connected: status })}></span>
    <div>
      {status ? `connected to ${target}` : `disconnected from ${target}`}
    </div>
  </div>
);

const Header = () => {
  const {
    daemon: { isRunning: daemonConnected },
    node: { isRunning: nodeConnected },
  } = useSelector((state) => state.wallet.socket);
  const {
    node: { setup },
    balance,
  } = useSelector((state) => state.wallet);
  const isMainnet = isMainNet(setup.chain.value);
  const masqValue = useMemo(
    () =>
      isMainnet ? balance.polygon.masq : parseInt(balance.mumbai.masq),   // removed the 1000 multiplier
    [isMainnet, balance]
  );

  const descriptionStyle = {
    background:
      masqValue < premiumTokenAmt
        ? `linear-gradient(0deg, #0085ff 0%, #00b2ff 100%)`
        : `linear-gradient(180deg, #FDBC40 28.13%, #FC605C 68.75%)`,
    fontSize: `10px`,
    lineHeight: `14px`,
    letterSpacing: `1px`,
  };

  const barStyle = {
    background:
      masqValue < premiumTokenAmt
        ? `linear-gradient(0deg, #0085ff 0%, #00b2ff 100%)`
        : `linear-gradient(180deg, #FDBC40 28.13%, #FC605C 68.75%)`,
    // width: masqValue < 1000 ? (masqValue * 197) / 1000 + 'px' : `197px`,
    width:
      masqValue < premiumTokenAmt
        ? (masqValue / premiumTokenAmt) * 1.0 * 100.0 + '%'
        : '100%',
  };

  return (
    <div className="settings-header d-flex justify-content-between align-items-start w-100">
      <div className="title">
        <img
          src={settingsBoxIcon}
          className="settingsIcon"
          alt="settingsBoxIcon"
        />
        <h2 className="advanced-settings">{' Advanced Settings'}</h2>
      </div>
      {/* <div className="d-flex justify-content-between align-items-center gap-4">
        <StatusItem status={daemonConnected} target="daemon" />
        <StatusItem status={nodeConnected} target="node" />
      </div> */}
      <div className="d-flex justify-content-between align-items-center gap-4">
        <div className="token-tiker">
          <div className="token-header">
            <div className="token-description" style={descriptionStyle}>
              {/* <div className="token-description"> */}
              {masqValue < premiumTokenAmt
                ? 'ADD ' +
                  (premiumTokenAmt - masqValue) +
                  ' MASQ TOKENS TO UNLOCK'
                : `YOU HAVE MASQ PREMIUM`}
            </div>
            <img className="token-mark" src={premiumIcon} />

            <div className="positionRelative token-impression">
              <OverlayTrigger
                className="mt-2 impressionIcon"
                myId="tokenTiker"
                position={'left'}
              >
                {'Get MASQ Premium features when you have at least ' +
                  thousandSeperater(premiumTokenAmt) +
                  ' MASQ in your wallet!'}
              </OverlayTrigger>
            </div>

            {/* <img className="token-impression" src={impressionIcon} /> */}
          </div>
          <div className="token-progress">
            <div className="token-progress-bar">
              <div className="token-progress-back"></div>
              <div className="token-progress-bar-value" style={barStyle}></div>
            </div>
            <div className="token-progress-value">
              <span className="token-exactValue">
                {masqValue < premiumTokenAmt
                  ? masqValue
                  : thousandSeperater(masqValue)}
                {/* 722 */}
              </span>
              {/* {masqValue < 1000 && '/1,000'} */}
              {`/2,000 MASQ`}
            </div>
          </div>
        </div>
        {/* <StatusItem status={daemonConnected} target="daemon" />
        <StatusItem status={nodeConnected} target="node" /> */}
      </div>
    </div>
  );
};

export default Header;
