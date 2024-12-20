import React from "react";
import {Button, DialogActions, Grid, Dialog, DialogContent, IconButton, Divider} from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";
import type {
    ProcessedEvent,
    SchedulerHelpers
} from "@aldabil/react-scheduler/types";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import {dataApi, eventApi, userApi} from "Frontend/api/ApiCalls";
import {useOutletContext} from "react-router-dom";
import {formatDate, lightenHexColor} from "Frontend/components/commonHelperFunctions";
import {GridRowSelectionModel} from "@mui/x-data-grid";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import UserSelectionGrid from "Frontend/components/DataGridsForSelection/UserSelectionGrid";
import {
    type RichTextEditorRef,
} from "mui-tiptap";
import {EventRequestModel, Event, EventResponseModel} from "Frontend/api/Models/CarrierModels/Event";
import {User} from "Frontend/api/Models/CentralModels/User";
import ReactHtmlParser from "react-html-parser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faCancel} from '@fortawesome/free-solid-svg-icons'
import {MessageItem} from "Frontend/views/Message/Components/MessageList";

interface CustomEditorProps {
    scheduler: SchedulerHelpers;
    setLoading: (loading: boolean) => void;
}

const CustomEditor = (props: CustomEditorProps) => {
    const event = props.scheduler.edited;
    const isView = event?.isView ?? false;

    // data state variables
    const [schedulerEventTypesOptions, setSchedulerEventTypesOptions] = React.useState<DataItem[]>([]);
    const [timeZones, setTimeZones] = React.useState<DataItem[]>([]);
    const [colors, setColors] = React.useState<DataItem[]>([]);
    const [priorityStatuses, setPriorityStatuses] = React.useState<DataItem[]>([]);

    // event details
    const [eventName, setEventName] = React.useState<string>(event?.title as string ?? "");
    const [descriptionHtml] = React.useState<string>(event?.descriptionHtml as string ?? "");
    const [eventType, setEventType] = React.useState<string>(event?.eventType);

    // event date and time and location
    const [startDateTime, setStartDateTime] = React.useState<string>(event?.startDateTime ?? formatDate(new Date().toString(), "mm dd yy, HH:mm"));
    const [endDateTime, setEndDateTime] = React.useState<string>(event?.endDateTime ?? formatDate(new Date().toString(), "mm dd yy, HH:mm"));
    const [timeZone, setTimeZone] = React.useState<string>(event?.timeZone as string ?? "");
    const [location, setLocation] = React.useState<string>(event?.subtitle as string ?? "");

    // event attendees
    const [selectedUserIds, setSelectedUserIds] = React.useState<GridRowSelectionModel>([]);

    // event misc
    const [notes, setNotes] = React.useState<string>(event?.notes as string ?? "");
    const [color, setColor] = React.useState<string>(event?.color as string ?? "");
    const [colorLabel, setColorLabel] = React.useState<string>(event?.colorLabel as string ?? "");
    const [priorityStatus, setPriorityStatus] = React.useState<string>(event?.priorityStatus as string ?? "");

    // textarea states
    const rteRef = React.useRef<RichTextEditorRef>();

    const handleSubmit = () => {
        props.scheduler.loading(true);

        let data: EventRequestModel = {
            event: {
                eventId: event?.event_id as number ?? undefined,
                eventName: eventName,
                descriptionHtml: rteRef.current?.editor?.getHTML() ?? "",
                eventType: eventType,
                priorityStatus: priorityStatus,

                startDateTime: startDateTime,
                endDateTime: endDateTime,
                timeZone: timeZone,
                location: location,

                notes: notes,
                color: color,
                colorLabel: colorLabel,
                deleted: false,
            } as Event,
            attendees: selectedUserIds.map(userId => parseInt(userId.toString())),
        }

        if(data.event.eventId) {
            eventApi(props.setLoading).updateEvent(data)
                .then((_: boolean) => {
                    props.scheduler.close();
                    props.scheduler.loading(false);
                })
                .catch((_) => {
                    props.scheduler.loading(false);
                });
        }
        else {
            eventApi(props.setLoading).createEvent(data)
                .then((_: number) => {
                    props.scheduler.close();
                    props.scheduler.loading(false);
                })
                .catch((_) => {
                    props.scheduler.loading(false);
                });
        }
    };

    React.useEffect(() => {
        dataApi(props.setLoading).getSchedulerEventTypesOptions()
            .then((response: DataItem[]) => {
                setSchedulerEventTypesOptions(response);
            });

        dataApi(props.setLoading).getTimeZones()
            .then((response: DataItem[]) => {
                setTimeZones(response);
            });

        dataApi(props.setLoading).getPriorityStatuses()
            .then((response: DataItem[]) => {
                setPriorityStatuses(response);
            });

        dataApi(props.setLoading).getColors()
            .then((response: DataItem[]) => {
                setColors(response);
            });

        if(event?.attendees && event?.attendees.length > 0) {
            setSelectedUserIds(event?.attendees);
        }
    }, []);

    return (
        <Dialog
            fullWidth={true}
            maxWidth="xl"
            open={true}
            onClose={props.scheduler.close}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogContent>
                <SectionLayout
                    sectionSubTitle="Event Details"
                    sectionTitle="Critical event Details"
                >
                    <Grid item md={6} xs={12}>
                        <RenderInput
                            inputType={InputType.TextField}
                            label="Event Name"
                            value={eventName}
                            handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setEventName(event.target.value), [eventName])}
                            isView={isView}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <RenderInput
                            inputType={InputType.MultipleAutoCompleteDropdown}
                            isView={isView}
                            required={true}
                            fullWidth={true}
                            label="Event Type"
                            value={[eventType]}
                            handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>,  newValue: string[]) => setEventType(newValue[0]), [eventType])}
                            autoCompleteOptions={schedulerEventTypesOptions}
                            multipleSelect={false}
                        />
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <RenderInput
                            inputType={InputType.RichTextArea}
                            rteRef={rteRef}
                            label="Event Description"
                            isView={isView}
                            value={descriptionHtml}
                        />
                    </Grid>
                </SectionLayout><br/>

                <SectionLayout
                    sectionSubTitle="Event date, time and location"
                    sectionTitle="Please enter information regarding event date and time"
                >
                    <Grid item md={6} xs={12}>
                        <RenderInput
                            inputType={InputType.DateTime}
                            label="Start Date & Time"
                            value={startDateTime}
                            handleChange={React.useCallback((value: any, _: any) => setStartDateTime(formatDate(value.format(), "mm dd yy, HH:mm")), [startDateTime])}
                            isView={isView}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <RenderInput
                            inputType={InputType.DateTime}
                            label="End Date & Time"
                            value={endDateTime}
                            handleChange={React.useCallback((value: any, _: any) => setEndDateTime(formatDate(value.format(), "mm dd yy, HH:mm")), [endDateTime])}
                            isView={isView}
                        />
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <RenderInput
                            inputType={InputType.TextField}
                            label="Location"
                            value={location}
                            handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLocation(event.target.value), [location])}
                            isView={isView}
                        />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <RenderInput
                            inputType={InputType.Dropdown}
                            label="Timezone"
                            value={timeZone}
                            handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setTimeZone(event.target.value), [timeZone, timeZones])}
                            data={timeZones}
                            isView={isView}
                            required={false}
                        />
                    </Grid>
                </SectionLayout><br/>

                <SectionLayout
                    sectionSubTitle="Miscellaneous information"
                    sectionTitle="Please enter any other informaton about the event"
                >
                    <Grid item md={6} xs={12}>
                        <RenderInput
                            inputType={InputType.Dropdown}
                            label="Priority Status"
                            value={priorityStatus}
                            handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPriorityStatus(event.target.value), [priorityStatus, priorityStatuses])}
                            data={priorityStatuses}
                            isView={isView}
                            required={false}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <RenderInput
                            inputType={InputType.AutoCompleteDropdown}
                            label="Color"
                            value={{ label: colorLabel, id: color }}
                            handleChange={React.useCallback((
                                event: React.SyntheticEvent<Element, Event>,
                                value: { label: string | undefined; id: string | undefined }
                            ) => {
                                setColor(value.id as string);
                                setColorLabel(value.label as string);
                            }, [color, colorLabel, colors])}
                            isView={isView}
                            autoCompleteOptions={colors.map(item => ({
                                id: item.key,
                                label: item.value
                            }))}
                            onInputChange={React.useCallback((
                                event: React.SyntheticEvent<Element, Event>,
                                value: string
                            ) => {
                                setColorLabel(value);
                            }, [color, colorLabel, colors])}
                        />
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <RenderInput
                            inputType={InputType.TextArea}
                            label="Notes"
                            value={notes}
                            required={false}
                            handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setNotes(event.target.value), [notes])}
                            isView={isView}
                        />
                    </Grid>
                </SectionLayout> <br/>


                <SectionLayout
                    sectionTitle="Attendees"
                    sectionSubTitle="Select users who will be a part of this event, this event will automatically get added to their calendar as well."
                >
                    {
                        !isView ?
                            <Grid item md={12} xs={12}>
                                <UserSelectionGrid
                                    isView={isView}
                                    setLoading={props.setLoading}
                                    selectedUserIds={selectedUserIds}
                                    setSelectedUserIds={React.useCallback((selectedUserIds: GridRowSelectionModel) => setSelectedUserIds(selectedUserIds), [selectedUserIds])}
                                    singleSelection={false}
                                />
                            </Grid> :
                            <></>
                    }
                    <>
                        <Grid item md={4} xs={12}>
                            <h3>Attending</h3>
                            <div style={{height: '300px', overflowY: 'auto', border: '1px solid #ccc'}}>
                                {
                                    event?.acceptedUsers.map((user: User, index: number) => (
                                        <React.Fragment key={index}>
                                            <MessageItem
                                                userId={user.userId as number}
                                                firstName={user.firstName}
                                                lastName={user.lastName}
                                                title={`<span style="color: green;">Declined</span>`}
                                                from={user.firstName + " " + user.lastName}
                                                messageHtml={""}
                                                read={false}
                                                updated={false}
                                            />
                                            <Divider/>
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <h3>Not Attending</h3>
                            <div style={{height: '300px', overflowY: 'auto', border: '1px solid #ccc'}}>
                                {
                                    event?.declinedUsers.map((user: User, index: number) => (
                                        <React.Fragment key={index}>
                                            <MessageItem
                                                userId={user.userId as number}
                                                firstName={user.firstName}
                                                lastName={user.lastName}
                                                title={`<span style="color: red;">Declined</span>`}
                                                from={user.firstName + " " + user.lastName}
                                                messageHtml={""}
                                                read={false}
                                                updated={false}
                                            />
                                            <Divider/>
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <h3>Unknown Status</h3>
                            <div style={{height: '300px', overflowY: 'auto',  border: '1px solid #ccc'}}>
                                {
                                    event?.unknownUsers.map((user: User, index: number) => (
                                        <React.Fragment key={index}>
                                            <MessageItem
                                                userId={user.userId as number}
                                                firstName={user.firstName}
                                                lastName={user.lastName}
                                                title={"Unknown"}
                                                from={user.firstName + " " + user.lastName}
                                                messageHtml={""}
                                                read={false}
                                                updated={false}
                                            />
                                            <Divider/>
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        </Grid>
                    </>
                </SectionLayout><br/>
            </DialogContent>

            <DialogActions>
                <Button onClick={props.scheduler.close}>Cancel</Button>
                {!isView ? <Button onClick={handleSubmit}>Confirm</Button> : <></>}
            </DialogActions>
        </Dialog>
    );
};

const SchedulerList = () => {
    const [setLoading] = useOutletContext<any>();
    const [selectedMonth] = React.useState<number>(new Date().getMonth() + 1);
    const [schedulerEvents, setSchedulerEvents] = React.useState<ProcessedEvent[]>([]);

    React.useEffect(() => {
        eventApi(setLoading).getAllEventsForUserIdBasedOnMonth(selectedMonth)
            .then((response: EventResponseModel[]) => {
                userApi(setLoading).getLoggedInUser()
                    .then((response2: User) => {
                        let localSchedulerEvents: ProcessedEvent[] = []
                        response.forEach(eventResponseModel => {
                            localSchedulerEvents.push({
                                event_id: eventResponseModel.event.eventId as number,
                                title: eventResponseModel.event.eventName + (eventResponseModel.event.deleted ? " (Cancelled)" : ""),
                                eventName: eventResponseModel.event.eventName,
                                subtitle: eventResponseModel.event.location,
                                start: eventResponseModel.event.startDateTime ? new Date(eventResponseModel.event.startDateTime) : new Date(),
                                end: eventResponseModel.event.endDateTime ? new Date(eventResponseModel.event.endDateTime) : new Date(),
                                startDateTime: eventResponseModel.event.startDateTime,
                                endDateTime: eventResponseModel.event.endDateTime,
                                color: eventResponseModel.event.deleted ? lightenHexColor(eventResponseModel.event.color ?? "#FFF", 50) : eventResponseModel.event.color,
                                colorLabel: eventResponseModel.event.colorLabel,
                                editable: true,
                                isView: eventResponseModel.event.deleted
                                    ? true
                                    : response2.userId !== eventResponseModel.event.createdByUserId,
                                deletable: !eventResponseModel.event.deleted && response2.userId === eventResponseModel.event.createdByUserId,
                                deleted: eventResponseModel.event.deleted,
                                draggable: false,
                                descriptionHtml: eventResponseModel.event.descriptionHtml,
                                attendees: eventResponseModel.attendees,
                                priorityStatus: eventResponseModel.event.priorityStatus,
                                notes: eventResponseModel.event.notes,
                                timeZone: eventResponseModel.event.timeZone,
                                eventType: eventResponseModel.event.eventType,
                                acceptedUsers: eventResponseModel.acceptedUsers,
                                declinedUsers: eventResponseModel.declinedUsers,
                                unknownUsers: eventResponseModel.unknownUsers
                            } as ProcessedEvent)
                        });
                        setSchedulerEvents(localSchedulerEvents);
                    });
            });
    }, []);

    const handleRsvpClick = (eventId: number, rsvp:boolean) => {
        let data: EventRequestModel = {
            event: {
                eventId: eventId,
            } as Event,
            rsvp: rsvp
        }

        eventApi(setLoading).updateEvent(data).then((_: boolean) => {})
    }

    return(
        <OutletLayout card={true}>
            <Scheduler
                agenda={false}
                events={schedulerEvents}
                month = {{
                    weekDays: [0, 1, 2, 3, 4, 5, 6],
                    weekStartOn: 0,
                    startHour: 0,
                    endHour: 24
                }}
                week = {{
                    weekDays: [0, 1, 2, 3, 4, 5, 6],
                    weekStartOn: 0,
                    startHour: 0,
                    endHour: 24,
                    step: 30
                }}
                day = {{
                    startHour: 0,
                    endHour: 24,
                    step: 30
                }}
                customEditor={(scheduler) =>
                    <CustomEditor
                        scheduler={scheduler}
                        setLoading={setLoading}
                    />
                }
                onDelete = {(eventId: number): Promise<void> => {
                    return new Promise((resolve, reject) => {
                        eventApi(setLoading).toggleEvent(eventId)
                            .then(() => {
                                window.location.reload();
                                resolve(); // Resolve the promise after the event is toggled
                            })
                            .catch(reject); // If event toggle fails, reject the promise
                    });
                }}
                viewerExtraComponent={(fields, event) => {
                    return (
                        <div>
                            {
                                 event.isView && !event.deleted ?
                                    <>
                                        <h5 style={{textAlign: "center", marginBottom: "10px"}}>RSVP</h5>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-evenly",
                                            width: "100%",
                                            marginBottom: "10px"
                                        }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border: "1px solid black",
                                                    padding: "5px 10px",
                                                    width: "48%",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => handleRsvpClick(event.event_id, true)}
                                            >
                                                <IconButton>
                                                    <FontAwesomeIcon icon={faCheckCircle} size="sm" color="green"/>
                                                </IconButton>
                                                <span style={{marginLeft: "8px"}}>Yes</span>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border: "1px solid black",
                                                    padding: "5px 10px",
                                                    width: "48%",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => handleRsvpClick(event.event_id, false)}
                                            >
                                                <IconButton onClick={() => {
                                                }}>
                                                    <FontAwesomeIcon icon={faCancel} size="sm" color="red"/>
                                                </IconButton>
                                                <span style={{marginLeft: "8px"}}>No</span>
                                            </div>
                                        </div>
                                    </> :
                                    <></>
                            }
                            <div>
                                {ReactHtmlParser(event.descriptionHtml)}
                            </div>
                        </div>
                    );
                }}
                viewerTitleComponent={(event) => {
                    return (
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <h3
                                style={{
                                    margin: 0,
                                    textDecoration: event.deleted ? 'line-through' : 'none'
                                }}
                            >
                                {event.eventName}
                            </h3>
                            <p style={{
                                margin: 0,
                                fontWeight: "bold"
                            }}>{event.deleted ? "(Cancelled)" : ""} Priority: {event.priorityStatus}</p>
                        </div>
                    );
                }}
                viewerSubtitleComponent={(event) => {
                    return (
                        <div>
                            <p style={{fontStyle: 'italic', color: 'gray'}}>
                                <b>Location:</b> {event.subtitle}
                            </p>
                        </div>
                    );
                }}
                eventRenderer={({event, ...props}) => {
                    return (
                        <div
                            style={{
                                height: "100%",
                                background: event.color,
                                color: "white",
                                overflowY: "auto",
                            }}
                            {...props}
                        >
                            <h4
                                style={{
                                    margin: 0,
                                    textDecoration: event.deleted ? 'line-through' : 'none',
                                    fontSize: "1rem"  // Larger font for h4
                                }}
                            >
                                {event.eventName} {event.deleted ? "(Cancelled)" : ""}
                            </h4>
                            <br/>
                            <p style={{margin: 0, fontSize: "0.9rem"}}>
                                <b>Priority:</b> {event.priorityStatus}
                            </p><br/>
                            <p style={{margin: 0, fontSize: "0.9rem"}}>
                                <b>Start Date & Time:</b> {formatDate(event.start.toString(), "mm dd yy, HH:mm")}
                            </p><br/>
                            <p style={{margin: 0, fontSize: "0.9rem"}}>
                                <b>End Date & Time:</b> {formatDate(event.end.toString(), "mm dd yy, HH:mm")}
                            </p>
                        </div>
                    );
                }}
            />
        </OutletLayout>
    );
}

export default SchedulerList;