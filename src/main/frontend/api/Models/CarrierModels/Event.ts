export type Event = {
    // Event details
    eventId?: number;
    eventName: string;
    descriptionHtml: string;
    eventType: string;
    priorityStatus: string;

    // Event date, time, and location
    startDateTime: Date; // ISO 8601 date string
    endDateTime: Date;   // ISO 8601 date string
    timeZone: string;
    location: string;

    // Event misc
    notes?: string;
    color: string;
    colorLabel: string;
    deleted: boolean;
    createdByUserId?: number;

    auditUserId?: number;
};

export type EventRequestModel = {
    event: Event;
    attendees: number[];
    rsvp?: boolean;
};

export type EventResponseModel = {
    event: Event;
    attendees: number[];
    userIdRsvpMapping: Record<number, boolean>;
};