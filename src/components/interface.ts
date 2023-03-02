enum Direction {
    Departure = 'Departure',
    Arrival = 'Arrival',
}

enum TrainStatus {
    OnTime = 'Ontime', // NORMAL
    Late = 'RETARD',
    Suppressed = 'SUPPRESSION_TOTALE',
}

enum EventLevel {
    None = 'Normal',
    Info = 'Information',
    Warn = 'Warning',
}

enum EventStatus {
    Late = 'RETARD',
    Modified = 'MODIFICATION_LIMITATION',
    Suppressed = 'SUPPRESSION',
}

interface TimeSpacerProps {
    time: Date;
}

interface TrainInformationStatus {
    trainStatus: TrainStatus;
    eventLevel: string;
    delay?: number
}

interface TrainPlatform {
    track: string;
    isTrackactive: boolean;
    trackGroupTitle?: string;
    trackGroupValue?: string;
    backgroundColor: null;
}

interface TrainTraffic {
    origin: string;
    destination: string;
    oldOrigin?: string;
    oldDestination?: string;
    eventStatus?: EventStatus;
    eventLevel: EventLevel;
}

interface TrainProps {
    direction: Direction;
    trainNumber: string;
    scheduledTime: Date;
    actualTime: Date;
    trainType: string;
    trainMode: string;
    informationStatus: TrainInformationStatus;
    platform: TrainPlatform;
    traffic: TrainTraffic;
    TrafficDetailsUrl: string;
    statusModification: null;
    uic: string;
    missionCode: null;
    trainLine?: string;
    isGL: boolean;
    presentation: {
        colorCode: string;
        textColorCode: string;
    };
    tt_row: number;
}

export { Direction, TimeSpacerProps, TrainProps };
