import * as _ from 'lodash';
import * as React from 'react';
import {Paper, Divider} from 'material-ui';
import {utils} from 'ts/utils/utils';
import {Fill, TokenByAddress} from 'ts/types';
import {TradeHistoryItem} from 'ts/components/trade_history/trade_history_item';
import {tradeHistoryStorage} from 'ts/local_storage/trade_history_storage';

const FILL_POLLING_INTERVAL = 1000;

interface TradeHistoryProps {
    tokenByAddress: TokenByAddress;
    userAddress: string;
}

interface TradeHistoryState {
    sortedFills: Fill[];
}

export class TradeHistory extends React.Component<TradeHistoryProps, TradeHistoryState> {
    private fillPollingIntervalId: number;
    public constructor(props: TradeHistoryProps) {
        super(props);
        const sortedFills = this.getSortedFills();
        this.state = {
            sortedFills,
        };
    }
    public componentWillMount() {
        this.startPollingForFills();
    }
    public componentWillUnmount() {
        this.stopPollingForFills();
    }
    public componentDidMount() {
        window.scrollTo(0, 0);
    }
    public render() {
        return (
            <div className="lg-px4 md-px4 sm-px2">
                <h3>Trade history</h3>
                <Divider />
                <div className="pt2" style={{height: 608, overflow: 'scroll'}}>
                    {this.renderTrades()}
                </div>
            </div>
        );
    }
    private renderTrades() {
        if (this.state.sortedFills.length === 0) {
            return this.renderEmptyNotice();
        }

        return _.map(this.state.sortedFills, (fill, index) => {
            return (
                <Paper
                    key={`${fill.orderHash}-${fill.filledValueT}-${index}`}
                    className="py1"
                    style={{margin: '3px 3px 15px 3px'}}
                >
                    <TradeHistoryItem
                        fill={fill}
                        tokenByAddress={this.props.tokenByAddress}
                        userAddress={this.props.userAddress}
                    />
                </Paper>
            );
        });
    }
    private renderEmptyNotice() {
        return (
            <Paper className="mt1 p2 mx-auto center" style={{width: '80%'}}>
                No filled orders yet.
            </Paper>
        );
    }
    private startPollingForFills() {
        this.fillPollingIntervalId = window.setInterval(() => {
            const sortedFills = this.getSortedFills();
            if (!utils.deepEqual(sortedFills, this.state.sortedFills)) {
                this.setState({
                    sortedFills,
                });
            }
        }, FILL_POLLING_INTERVAL);
    }
    private stopPollingForFills() {
        clearInterval(this.fillPollingIntervalId);
    }
    private getSortedFills() {
        const fillsByHash = tradeHistoryStorage.getUserFillsByHash(this.props.userAddress);
        const fills = _.values(fillsByHash);
        const sortedFills = _.sortBy(fills, [(fill: Fill) => fill.blockTimestamp * -1]);
        return sortedFills;
    }
}
