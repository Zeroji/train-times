import { Component, Fragment, FunctionalComponent, h } from 'preact'
import { Direction, TimeSpacerProps, TrainProps } from './interface'
import { Train } from './train';

const BaseURL = "https://garesetconnexions-online.azure-api.net";
const DateOptions: [undefined, Intl.DateTimeFormatOptions] = [undefined, { weekday: 'long', day: 'numeric', month: 'long' }]
const TimeOptions: [undefined, Intl.DateTimeFormatOptions] = [undefined, { hour: 'numeric', minute: '2-digit' }];

const TimeSpacer: FunctionalComponent<TimeSpacerProps> = (props: TimeSpacerProps) => {
    return <tr class="time-spacer">
        <td colSpan={4}>
            {props.time.toLocaleDateString(...DateOptions)}
        </td>
    </tr >;
}

interface TimeTableProps {
    direction: Direction;
    setDepartures: () => void;
    setArrivals: () => void;
    uic: string;
}


interface TimeTableState {
    loading: boolean;
    lastUpdate?: Date;
    trains: TrainProps[];
}

function DatesEqual(dateA: Date, dateB: Date): boolean {
    return (
        dateA !== undefined && dateB !== undefined &&
        (dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate())
    );
}

class TimeTable extends Component<TimeTableProps, TimeTableState> {
    constructor() {
        super();
        this.state = {
            loading: false,
            lastUpdate: null,
            trains: [],
        };
    }

    fetchTrains() {
        // Make request
        this.setState({ ...this.state, loading: true });

        let dir = this.props.direction + "s";
        let uic = this.props.uic;
        if ((dir !== undefined)) {
            let url = `${BaseURL}/API/PIV/${dir}/${this.props.uic}`;
            console.debug(`Requesting data from ${url}`);
            fetch(url, {
                headers: {
                    'ocp-apim-subscription-key': '3fd14f8500c64ed69e7cb05f2c3a4477'
                }
            }
            )
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        // TODO: Clean up inconsistencies in informationStatus.trainStatus codes
                        this.setState({
                            loading: false, lastUpdate: new Date(), trains: data.map(train => {
                                train.scheduledTime = new Date(train.scheduledTime);
                                train.actualTime = new Date(train.actualTime);
                                return train;
                            })
                        });
                    } else {
                        console.log("Request failed:", data);
                        this.setState({ loading: false, trains: [] });
                    }
                });
        }
    }

    componentDidMount() {
        // Trigger train update
        setTimeout(this.fetchTrains.bind(this), 10);
    }

    render(props: TimeTableProps, state: TimeTableState) {
        let lastDay = new Date(Date.now());

        let fragments = [];
        state.trains.forEach((train, i) => {
            if (!DatesEqual(train.scheduledTime, lastDay)) {
                fragments.push(<TimeSpacer time={train.scheduledTime} />);
                lastDay = train.scheduledTime;
            }
            fragments.push(<Train tt_row={i} {...train} />);
        });

        let updateText = '';
        if (state.loading) updateText = 'Updating...';
        else if (state.lastUpdate != null) updateText = 'Updated: ' + state.lastUpdate.toLocaleTimeString(...TimeOptions);

        let depClass = 'departures';
        let arrClass = 'arrivals';

        if (props.direction === Direction.Departure) depClass += ' active';
        if (props.direction === Direction.Arrival) arrClass += ' active';

        return <Fragment>
            <nav className="selector">
                <div className={depClass} onClick={props.setDepartures}>Departures</div>
                <div className={arrClass} onClick={props.setArrivals}>Arrivals</div>
                <div className="updates">{updateText}</div>
            </nav>
            <table class={"trains " + props.direction}><tbody>
                {fragments}
            </tbody></table>
        </Fragment>;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log("did update", this.props, prevProps, prevState.trains.length, this.state.trains.length);
        if ((this.props.uic != prevProps.uic) || (this.props.direction != prevProps.direction)) {
            this.fetchTrains();
        }
    }
}

export { Direction, TimeTable };
