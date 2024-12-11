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
import {dataApi} from "Frontend/api/ApiCalls";
import {useOutletContext} from "react-router-dom";
import {formatOptionsForAutoComplete} from "Frontend/components/commonHelperFunctions";
import {GridRowSelectionModel} from "@mui/x-data-grid";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import UserSelectionGrid from "Frontend/components/DataGridsForSelection/UserSelectionGrid";
import {
    type RichTextEditorRef,
} from "mui-tiptap";

interface CustomEditorProps {
    scheduler: SchedulerHelpers;
    isView: boolean;
    setLoading: any;
}

const CustomEditor = ({ scheduler, isView, setLoading }: CustomEditorProps) => {
    const event = scheduler.edited;

    // data state variables
    const [schedulerEventTypesOptions, setSchedulerEventTypesOptions] = React.useState<{ [key: string]: { label: string; value: string }[] }>({});
    const [timeZones, setTimeZones] = React.useState<DataItem[]>([]);
    const [colors, setColors] = React.useState<DataItem[]>([]);
    const [priorityStatuses, setPriorityStatuses] = React.useState<DataItem[]>([]);

    // event details
    const [eventName, setEventName] = React.useState<string>("");
    const [descriptionHtml, setDescriptionHtml] = React.useState<string>("");
    const [eventType, setEventType] = React.useState<{ id: string; label: string; }[]>([]);

    // event date and time and location
    const [startDateTime, setStartDateTime] = React.useState<Date>(new Date());
    const [endDateTime, setEndDateTime] = React.useState<Date>(new Date());
    const [timeZone, setTimeZone] = React.useState<string>("");
    const [location, setLocation] = React.useState<string>("");

    // event attendees
    const [selectedUserIds, setSelectedUserIds] = React.useState<GridRowSelectionModel>([]);

    // event misc
    const [notes, setNotes] = React.useState<string>("");
    const [color, setColor] = React.useState<string>("");
    const [colorLabel, setColorLabel] = React.useState<string>("");
    const [priority, setPriority] = React.useState<string>("");

    // textarea states
    const rteRef = React.useRef<RichTextEditorRef>();

    // Make your own form/state
    const [state, setState] = React.useState({
        title: event?.title || "",
        description: event?.description || ""
    });
    const [error, setError] = React.useState("");

    const handleChange = (value: string, name: string) => {
        setState((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleSubmit = async () => {
        // Your own validation
        if ((state.title as string).length < 3) {
            return setError("Min 3 letters");
        }

        try {
            scheduler.loading(true);

            /**Simulate remote data saving */
            const added_updated_event = (await new Promise((res) => {
                /**
                 * Make sure the event have 4 mandatory fields
                 * event_id: string|number
                 * title: string
                 * start: Date|string
                 * end: Date|string
                 */
                setTimeout(() => {
                    res({
                        event_id: event?.event_id || Math.random(),
                        title: state.title,
                        start: scheduler.state.start.value,
                        end: scheduler.state.end.value,
                        description: state.description
                    });
                }, 3000);
            })) as ProcessedEvent;

            scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
            scheduler.close();
        } finally {
            scheduler.loading(false);
        }
    };

    React.useEffect(() => {
        dataApi(setLoading).getSchedulerEventTypesOptions()
            .then((response: { [key: string]: { label: string; value: string }[] }) => {
                setSchedulerEventTypesOptions(response);
            });

        dataApi(setLoading).getTimeZones()
            .then((response: DataItem[]) => {
                setTimeZones(response);
            });

        dataApi(setLoading).getPriorityStatuses()
            .then((response: DataItem[]) => {
                setPriorityStatuses(response);
            });

        dataApi(setLoading).getColors()
            .then((response: DataItem[]) => {
                setColors(response);
            });
    }, []);

    return (
        <Dialog
            fullWidth={true}
            maxWidth="xl"
            open={true}
            onClose={scheduler.close}
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
                            value={eventType}
                            handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>,  newValue: { id: string; label: string; }[]) => setEventType(newValue), [eventType])}
                            autoCompleteOptions={formatOptionsForAutoComplete(schedulerEventTypesOptions)}
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
                    {/*<Grid item md={6} xs={12}>*/}
                    {/*    <RenderInput*/}
                    {/*        inputType={InputType.DateTime}*/}
                    {/*        label="Start Date & Time"*/}
                    {/*        value={startDateTime}*/}
                    {/*        handleChange={React.useCallback((value: any, context: any) => setStartDateTime(value), [startDateTime])}*/}
                    {/*        isView={isView}*/}
                    {/*    />*/}
                    {/*</Grid>*/}
                    {/*<Grid item md={6} xs={12}>*/}
                    {/*    <RenderInput*/}
                    {/*        inputType={InputType.DateTime}*/}
                    {/*        label="End Date & Time"*/}
                    {/*        value={endDateTime}*/}
                    {/*        handleChange={React.useCallback((value: any, context: any) => setEndDateTime(value), [endDateTime])}*/}
                    {/*        isView={isView}*/}
                    {/*    />*/}
                    {/*</Grid>*/}
                    <Grid item md={8} xs={12}>
                        <RenderInput
                            inputType={InputType.TextField}
                            label="Location"
                            value={location}
                            handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setEventName(event.target.value), [eventName])}
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
                            value={priority}
                            handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setPriority(event.target.value), [priority, priorityStatuses])}
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
                            required={false}
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
                    <Grid item md={12} xs={12}>
                        <UserSelectionGrid
                            isView={isView}
                            setLoading={setLoading}
                            selectedUserIds={selectedUserIds}
                            setSelectedUserIds={React.useCallback((selectedUserIds: GridRowSelectionModel) => setSelectedUserIds(selectedUserIds), [selectedUserIds])}
                            singleSelection={false}
                        />
                    </Grid>
                </SectionLayout><br/>
            </DialogContent>

            <DialogActions>
                <Button onClick={scheduler.close}>Cancel</Button>
                <Button onClick={handleSubmit}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};

const SchedulerList = () => {
    const [setLoading] = useOutletContext<any>();
    return(
        <OutletLayout card={true}>
            <Scheduler
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
                            <p>Useful to render custom fields...</p>
                            <p>Description: {event.description || "Nothing..."}</p>
                        </div>
                    );
                }}
            />
        </OutletLayout>
    );
}

export default SchedulerList;