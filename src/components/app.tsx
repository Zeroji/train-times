import { h } from 'preact';
import { Router } from 'preact-router';
import { Direction, TimeTable } from "./timeTable";

const App = () => (
	<div id="app">
		<TimeTable direction={Direction.Departure} uic='0087747006' />
	</div>
);

export default App;
