import {User} from "Frontend/api/Models/CentralModels/User";

export type Event = {
    // Event details
    eventId?: number;
    eventName?: string;
    descriptionHtml?: string;
    eventType?: string;
    priorityStatus?: string;

    // Event date, time, and location
    startDateTime?: string;
    endDateTime?: string;
    timeZone?: string;
    location?: string;

    // Event misc
    notes?: string;
    color?: string;
    colorLabel?: string;
    deleted?: boolean;
    createdByUserId?: number;

    auditUserId?: number;
};

export type EventRequestModel = {
    event: Event;
    attendees?: number[];
    rsvp?: boolean;
};

export type EventResponseModel = {
    event: Event;
    attendees: number[];
    userIdRsvpMapping: Record<number, boolean>;
    acceptedUsers: User[];
    declinedUsers: User[];
    unknownUsers: User[];
};