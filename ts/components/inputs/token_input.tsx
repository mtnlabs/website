import * as _ from 'lodash';
import * as React from 'react';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {Dispatcher} from 'ts/redux/dispatcher';
import {RequiredLabel} from 'ts/components/ui/required_label';
import {AssetToken, Side, TokenBySymbol, BlockchainErrs, Token} from 'ts/types';
import {AssetPicker} from 'ts/components/generate_order/asset_picker';
import {NewTokenDialog} from 'ts/components/generate_order/new_token_dialog';
import {customTokenStorage} from 'ts/local_storage/custom_token_storage';
import {InputLabel} from 'ts/components/ui/input_label';

const TOKEN_ICON_DIMENSION = 80;

interface TokenInputProps {
    blockchain: Blockchain;
    blockchainErr: BlockchainErrs;
    dispatcher: Dispatcher;
    label: string;
    side: Side;
    assetToken: AssetToken;
    updateChosenAssetToken: (side: Side, token: AssetToken) => void;
    tokenBySymbol: TokenBySymbol;
}

interface TokenInputState {
    isHoveringIcon: boolean;
    isNewTokenDialogOpen: boolean;
    isPickerOpen: boolean;
}

const styles = {
    tokenIconBox: {
        border: '1px solid rgb(224, 224, 224)',
        cursor: 'pointer',
    },
};

export class TokenInput extends React.Component<TokenInputProps, TokenInputState> {
    constructor(props: TokenInputProps) {
        super(props);
        this.state = {
            isHoveringIcon: false,
            isNewTokenDialogOpen: false,
            isPickerOpen: false,
        };
    }
    public render() {
        const token = this.props.tokenBySymbol[this.props.assetToken.symbol];
        const label = <RequiredLabel label={this.props.label} />;
        const iconStyles = {
            cursor: 'pointer',
            opacity: this.state.isHoveringIcon ? 0.8 : 1,
        };
        return (
            <div className="relative">
                <div className="pb1">
                    <InputLabel text={label} />
                </div>
                <div
                    style={styles.tokenIconBox}
                    onMouseEnter={this.onToggleHover.bind(this, true)}
                    onMouseLeave={this.onToggleHover.bind(this, false)}
                    onClick={this.onAssetClicked.bind(this)}
                >
                    <div
                        className="mx-auto pt2"
                        style={{width: TOKEN_ICON_DIMENSION}}
                    >
                        <img
                            style={{width: TOKEN_ICON_DIMENSION, height: TOKEN_ICON_DIMENSION, ...iconStyles}}
                            src={token.iconUrl}
                        />
                    </div>
                    <div className="py1 center" style={{color: colors.grey500}}>
                        {token.name}
                    </div>
                </div>
                <AssetPicker
                    isOpen={this.state.isPickerOpen}
                    currentAssetToken={this.props.assetToken}
                    onAssetChosen={this.onAssetChosen.bind(this)}
                    onCustomAssetChosen={this.onCustomAssetChosen.bind(this)}
                    side={this.props.side}
                    tokenBySymbol={this.props.tokenBySymbol}
                />
                <NewTokenDialog
                    blockchain={this.props.blockchain}
                    isOpen={this.state.isNewTokenDialogOpen}
                    onCloseDialog={this.onCloseNewTokenDialog.bind(this)}
                    onNewTokenSubmitted={this.onNewTokenSubmitted.bind(this)}
                    tokenBySymbol={this.props.tokenBySymbol}
                />
            </div>
        );
    }
    private onToggleHover(isHoveringIcon: boolean) {
        this.setState({
            isHoveringIcon,
        });
    }
    private onCloseNewTokenDialog() {
        this.setState({
            isNewTokenDialogOpen: false,
        });
    }
    private onAssetClicked() {
        if (this.props.blockchainErr !== '') {
            this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            return;
        }

        this.setState({
            isPickerOpen: true,
        });
    }
    private onAssetChosen(side: Side, assetToken: AssetToken) {
        this.setState({
            isPickerOpen: false,
        });
        this.props.updateChosenAssetToken(side, assetToken);
    }
    private onCustomAssetChosen() {
        this.setState({
            isNewTokenDialogOpen: true,
            isPickerOpen: false,
        });
    }
    private onNewTokenSubmitted(newToken: Token) {
        customTokenStorage.addCustomToken(newToken);
        this.props.dispatcher.addTokenToTokenBySymbol(newToken);
        this.props.updateChosenAssetToken(this.props.side, {
            amount: this.props.assetToken.amount,
            symbol: newToken.symbol,
        });
        this.setState({
            isNewTokenDialogOpen: false,
        });
    }
}
