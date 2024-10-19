import {useOutletContext} from "react-router-dom";
import React from "react";
import {getURLParamValue, isEditMode, isViewMode} from "Frontend/components/commonHelperFunctions";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import {Grid} from "@mui/material";
import RenderInput, {InputType} from "Frontend/components/FormRenderer/RenderInput";
import SectionLayout from "Frontend/components/Layouts/DashboardLayout/SectionLayout";
import {GridRowSelectionModel} from "@mui/x-data-grid";
import ActionFooter from "Frontend/components/FormRenderer/ActionFooter";
import {navigatingRoutes} from "Frontend/navigation";
import {LeadRequestModel} from "Frontend/api/Models/CarrierModels/Lead";
import {dataApi, leadApi, userGroupApi} from "Frontend/api/ApiCalls";
import {DataItem} from "Frontend/api/Models/CentralModels/Data";
import {UserGroupRequestModel, UserGroupResponseModel} from "Frontend/api/Models/CarrierModels/UserGroup";
import UserSelectionGrid from "Frontend/components/DataGridsForSelection/UserSelectionGrid";

const AddOrEditUserGroup = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();

    // state variables for lead personal details
    const [name, setName] = React.useState<string>("");
    const [description  , setDescription] = React.useState<string>("");

    // misc state variables
    const [notes, setNotes] = React.useState<string>("");

    // selected userIds
    const [selectedUserIds, setSelectedUserIds] = React.useState<GridRowSelectionModel>([]);

    // local variables
    const isEdit = isEditMode("userGroupId");
    const isView = isViewMode("userGroupId");
    let userGroupId = (isEdit || isView) ? parseInt(getURLParamValue("userGroupId") as string) : null;

    // function to fetch lead details by id
    const handleFetchUserGroupDetailsById = (userGroupId: number) => {
       userGroupApi(setLoading).getUserGroupDetailsById(userGroupId as number).then((userGroupResponseModel: UserGroupResponseModel) => {
           // set the user group details
           setName(userGroupResponseModel.userGroup.name);
           setDescription(userGroupResponseModel.userGroup.description);

           // set misc
           setNotes(userGroupResponseModel.userGroup.notes ?? "");

           // set state for selected user ids
           setSelectedUserIds(userGroupResponseModel.userIds);
       });
    }

    // function to create/edit lead
    const handleSubmit = () => {
        let requestData: UserGroupRequestModel = {
            userGroup: {
                userGroupId: isEdit ? userGroupId as number : undefined,
                name: name,
                description: description,
                notes: notes
            },
            userIds: selectedUserIds.map(userId => parseInt(userId.toString()))
        };
        if(isEdit) {
            userGroupApi(setLoading).updateUserGroup(requestData).then(() => {});
        }
        else{
            userGroupApi(setLoading).createUserGroup(requestData).then(() => {});
        }
    }

    React.useEffect(() => {
        if(isView || isEdit) {
            handleFetchUserGroupDetailsById(userGroupId as number);
        }
    }, []);
    return(
        <OutletLayout card={false}>
            <SectionLayout
                sectionTitle="User Group Details"
                sectionSubTitle="This information can be edited"
            >
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.TextField}
                        label="Name"
                        value={name}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value), [name])}
                        isView={isView}
                    />
                </Grid>
                <Grid item md={12} xs={12}>
                    <RenderInput
                        inputType={InputType.TextArea}
                        label="Description"
                        value={description}
                        handleChange={React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => setDescription(event.target.value), [description])}
                        isView={isView}
                    />
                </Grid>
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Misc Information"
                sectionSubTitle="This information can be edited"
            >
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
            </SectionLayout><br/>

            <SectionLayout
                sectionTitle="Users"
                sectionSubTitle="Select users who will be a part of this group."
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

            {isView ?
                <></> :
                <ActionFooter
                    paramValue="userGroupId"
                    handleSubmit={handleSubmit}
                    cancelUrl={navigatingRoutes.dashboard.users}
                    buttonText="User group"
                />
            }
        </OutletLayout>
    );
}

export default AddOrEditUserGroup;