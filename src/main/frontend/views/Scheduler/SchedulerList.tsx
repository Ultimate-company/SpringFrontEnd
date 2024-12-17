import React from "react";
import {Button, DialogActions, Grid, Dialog, DialogContent} from "@mui/material";
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
import {formatOptionsForAutoComplete} from "Frontend/components/commonHelperFunctions";
import {GridRowSelectionModel} from "@mui/x-data-grid";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import UserSelectionGrid from "Frontend/components/DataGridsForSelection/UserSelectionGrid";
import {
    type RichTextEditorRef,
} from "mui-tiptap";
import {EventRequestModel, Event, EventResponseModel} from "Frontend/api/Models/CarrierModels/Event";
import {User} from "Frontend/api/Models/CentralModels/User";
import ReactHtmlParser from "react-html-parser";

interface CustomEditorProps {
    scheduler: SchedulerHelpers;
    isView: boolean;
    setLoading: (loading: boolean) => void;
}

const CustomEditor = (props: CustomEditorProps) => {
    const event = props.scheduler.edited;

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
    const [startDateTime, setStartDateTime] = React.useState<Date>(event?.start as Date ?? new Date());
    const [endDateTime, setEndDateTime] = React.useState<Date>(event?.end as Date ?? new Date());
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
                eventId: event?.eventId as number ?? undefined,
                eventName: eventName,
                descriptionHtml: rteRef.current?.editor?.getHTML() ?? "",
                eventType: eventType[0] || "",
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

        console.log("submit: ",data);
        // eventApi(props.setLoading).createEvent(data)
        //     .then((_: number) => {
        //         props.scheduler.close();
        //         props.scheduler.loading(false);
        //     });
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
                            isView={props.isView}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <RenderInput
                            inputType={InputType.MultipleAutoCompleteDropdown}
                            isView={props.isView}
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
                            isView={props.isView}
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
                            handleChange={React.useCallback((value: any, _: any) => setStartDateTime(value), [startDateTime])}
                            isView={props.isView}
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <RenderInput
                            inputType={InputType.DateTime}
                            label="End Date & Time"
                            value={endDateTime}
                            handleChange={React.useCallback((value: any, _: any) => setEndDateTime(value), [endDateTime])}
                            isView={props.isView}
                        />
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <RenderInput
                            inputType={InputType.TextField}
                            label="Location"
                            value={location}
                            handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setLocation(event.target.value), [location])}
                            isView={props.isView}
                        />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <RenderInput
                            inputType={InputType.Dropdown}
                            label="Timezone"
                            value={timeZone}
                            handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setTimeZone(event.target.value), [timeZone, timeZones])}
                            data={timeZones}
                            isView={props.isView}
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
                            isView={props.isView}
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
                            isView={props.isView}
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
                            isView={props.isView}
                        />
                    </Grid>
                </SectionLayout> <br/>

                <SectionLayout
                    sectionTitle="Attendees"
                    sectionSubTitle="Select users who will be a part of this event, this event will automatically get added to their calendar as well."
                >
                    <Grid item md={12} xs={12}>
                        <UserSelectionGrid
                            isView={props.isView}
                            setLoading={props.setLoading}
                            selectedUserIds={selectedUserIds}
                            setSelectedUserIds={React.useCallback((selectedUserIds: GridRowSelectionModel) => setSelectedUserIds(selectedUserIds), [selectedUserIds])}
                            singleSelection={false}
                        />
                    </Grid>
                </SectionLayout><br/>
            </DialogContent>

            <DialogActions>
                <Button onClick={props.scheduler.close}>Cancel</Button>
                <Button onClick={handleSubmit}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};

const SchedulerList = () => {
    const [setLoading] = useOutletContext<any>();
    const [selectedMonth, setSelectMonth] = React.useState<number>(new Date().getMonth() + 1);
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
                                title: eventResponseModel.event.eventName,
                                subtitle: eventResponseModel.event.location,
                                start: new Date(eventResponseModel.event.startDateTime.toString()),
                                end: new Date(eventResponseModel.event.endDateTime.toString()),
                                color: eventResponseModel.event.color,
                                colorLabel: eventResponseModel.event.colorLabel,
                                editable: response2.userId == eventResponseModel.event.createdByUserId,
                                deletable: response2.userId == eventResponseModel.event.createdByUserId,
                                descriptionHtml: eventResponseModel.event.descriptionHtml,
                                attendees: eventResponseModel.attendees,
                                priorityStatus: eventResponseModel.event.priorityStatus,
                                notes: eventResponseModel.event.notes,
                                timeZone: eventResponseModel.event.timeZone,
                                eventType: eventResponseModel.event.eventType
                            } as ProcessedEvent)
                        });
                        setSchedulerEvents(localSchedulerEvents);
                    });
            });
    }, []);

    return(
        <OutletLayout card={true}>
            <Scheduler
                agenda={false}
                events={schedulerEvents}
                customEditor={(scheduler) =>
                    <CustomEditor
                        scheduler={scheduler}
                        isView={false}
                        setLoading={setLoading}
                    />
                }
                viewerExtraComponent={(fields, event) => {
                    return (
                        <div>
                            <p>Priority: {ReactHtmlParser(event.priorityStatus)}</p>
                            <p>Description: {ReactHtmlParser(event.descriptionHtml)}</p>
                        </div>
                    );
                }}
            />
        </OutletLayout>
    );
}

export default SchedulerList;