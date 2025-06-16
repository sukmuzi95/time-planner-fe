export interface Schedule {
  id: number;
  title: string;
  startDateTime: string;
  endDateTime: string;
  repeatOption?: {
    type: string;
    interval: number;
    untilDate: string;
  };
}

export interface Calendar {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  extendedProps: {
    repeatOption?: Schedule['repeatOption'];
    raw: Schedule;
  };
}
