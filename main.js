
import { html, Component, render } from 'https://unpkg.com/htm/preact/index.mjs?module'

const BaseURL = "https://garesetconnexions-online.azure-api.net";
const DateOptions = [undefined, { weekday: 'long', day: 'numeric', month: 'long' }]
const TimeOptions = [undefined, { hour: 'numeric', minute: '2-digit' }];

class TimeTable extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            trains: [],
        };
    }

    fetchTrains() {
        // Make request
        this.setState({ loading: true, trains: this.state.trains });

        let dir = { departures: 'Departures', arrivals: 'Arrivals' }[this.props.direction];
        let uic = this.props.uic;
        if ((dir !== undefined) && (uic != 0)) {
            let url = `${BaseURL}/API/PIV/${dir}/${this.props.uic}`;
            console.debug(`Requesting data from ${url}`);
            fetch(url, {
                // fetch(`./sample_dep.json`, {
                headers: {
                    'ocp-apim-subscription-key': 'REDACTED'
                }
            }
            )
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        this.setState({
                            loading: false, trains: data.map(train => {
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
        // console.log("This should start fetching API stuff");
        setTimeout(this.fetchTrains.bind(this), 10);
    }

    render(props, state) {
        let lastDay = new Date(Date.now()); // - 2 * 86400_000);

        let rows = [];
        state.trains.forEach((train, i) => {
            if (!DatesEqual(train.scheduledTime, lastDay)) {
                rows.push(html`<${TimeSpacer} time=${train.scheduledTime}/>`);
                lastDay = train.scheduledTime;
            }
            rows.push(html`<${Train} row=${i} ...${train}/>`);
        });

        return html`
            <h2>List of ${props.direction}</h2>
            <span class="debug">UIC=${props.uic}</span>
            <table class="trains ${props.direction}"><tbody>
            ${rows}</tbody></table>`;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log("did update", this.props, prevProps, prevState.trains.length, this.state.trains.length);
        if ((this.props.uic != prevProps.uic) || (this.props.direction != prevProps.direction)) {
            this.fetchTrains();
        }
    }
}

function DatesEqual(dateA, dateB) {
    return (
        dateA !== undefined && dateB !== undefined &&
        (dateA.getYear() === dateB.getYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate())
    );
}

function TimeSpacer(props) {
    return html`<tr class="time-spacer"><td colspan=4>${props.time.toLocaleDateString(...DateOptions)}</td></tr>`;
}

function Train(props) {
    const arrival = (props.direction === 'Arrival');

    return html`<tr class="train ${props.row % 2 ? 'odd' : 'even'}">
    <td class="type">
        <span class="type">${props.trainType}</span><br/>
        <span class="number">${props.trainNumber}</span>
    </td>
    <td class="time"><b>${props.scheduledTime.toLocaleTimeString(...TimeOptions)}</b></td>
    <td class="dest">${props.traffic.destination}</td>
    <td class="platform" active="${props.platform.isTrackactive}"><span class="track"><!--Voie<br/>-->${props.platform.track}</span></td>
        </tr>`;
}

function App(props) {
    return html`
    <${TimeTable} direction="departures" uic="0087747006"/>
    `;
}

render(html`<${App}/>`, document.body);
