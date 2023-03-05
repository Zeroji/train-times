import { Component, h } from 'preact';
import { Direction, TimeTable } from "./timeTable";

interface AppProps { }
interface AppState {
	direction: Direction;
	uic: string;
}

class App extends Component<AppProps, AppState> {
	constructor() {
		super();

		this.state = {
			direction: Direction.Departure,
			uic: '0087747006',
		};

		let match = window.location.hash.match(/(dep|arr)-(\d+)/);
		if (match !== null) {
			this.state = {
				direction: match[1] == 'dep' ? Direction.Departure : Direction.Arrival,
				uic: match[2],
			};
		}
	}

	render(props: AppProps, state: AppState) {
		let depClass = 'departures';
		let arrClass = 'arrivals';

		if (state.direction === Direction.Departure) depClass += ' active';
		if (state.direction === Direction.Arrival) arrClass += ' active';

		return <div id="app">
			<TimeTable direction={state.direction} uic={state.uic}
				setDepartures={() => this.setState({ direction: Direction.Departure })}
				setArrivals={() => this.setState({ direction: Direction.Arrival })} />
		</div >;
	}

	componentDidUpdate(previousProps: Readonly<AppProps>, previousState: Readonly<AppState>, snapshot: any): void {
		// Update window hash
		window.location.hash = '#' + (this.state.direction == Direction.Departure ? 'dep' : 'arr') + '-' + this.state.uic;
	}
}

export default App;
