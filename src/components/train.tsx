import { FunctionalComponent, h } from 'preact'
import { Direction, EventLevel, TrainProps, TrainStatus } from './interface'

const TimeOptions: [undefined, Intl.DateTimeFormatOptions] = [undefined, { hour: 'numeric', minute: '2-digit' }];


const TimeCell: FunctionalComponent<TrainProps> = (props: TrainProps) => {
    let classes = ['time'];
    switch (props.informationStatus.trainStatus) {
        case TrainStatus.OnTime:
            break;
        case TrainStatus.Late:
            classes.push('late');
            break;
        case TrainStatus.Suppressed:
            classes.push('deleted');
            break;
        default:
            classes.push('unknown');
            break;
    }

    return <td className={classes.join(' ')}>
        <b>{props.scheduledTime.toLocaleTimeString(...TimeOptions)}</b>
    </td>;
}


const Train: FunctionalComponent<TrainProps> = (props: TrainProps) => {
    let badges = [];
    let delay = props.informationStatus.delay;
    if (delay !== null && delay > 0) {
        let hours = Math.floor(delay / 60);
        let minutes = delay % 60;
        let text = minutes + 'm';
        if (hours > 0) text = hours + 'h' + String(minutes).padStart(2, '0');
        badges.push(<span className="delayed">+{text}</span>);
    }

    return <tr className={"train " + (props.tt_row % 2 ? "odd" : "even")}>
        <td className="type">
            <span className="type">{props.trainType}</span>
            <span className="number">{props.trainNumber}</span>
        </td>
        <TimeCell {...props} />
        <td className="dest">{badges}<span className="city">{props.traffic.destination}</span></td>
        <td className="platform" data-active={props.platform.isTrackactive || null}>
            <span className="track">{props.platform.track}</span>
        </td>
    </tr >;
}

export { Train };
