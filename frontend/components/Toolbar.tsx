import React from "react";
import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper
} from "@mui/material";
import Draggable from 'react-draggable';
import {notificationSettings} from "Frontend/components/Snackbar/NotificationSnackbar";
import toast from "react-hot-toast";
import BlueButton from "Frontend/components/FormInputs/BlueButton";
import LinkButton from "Frontend/components/FormInputs/LinkButton";
import {navigatingRoutes} from "Frontend/navigation";

interface PaperComponentProps {
    children?: React.ReactNode;
    otherProps?: any;
}
interface ToolbarProps {
    page?: string;
}

const PaperComponent = (props: PaperComponentProps) => {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props.otherProps}>{props.children}</Paper>
        </Draggable>
    );
}
const Toolbar= (props : ToolbarProps) => {

    let importText = "", addText = "", link = "";
    switch(props.page){
        case "User" :
            importText = "Import Users";
            addText = "Add User";
            link = navigatingRoutes.dashboard.addUser;
            break;
        case "Lead" :
            importText = "Import Leads";
            addText = "Add Lead";
            link = navigatingRoutes.dashboard.addLead;
            break;
        case "User Group" :
            importText = "Import User Groups";
            addText = "Add User Group";
            link = navigatingRoutes.dashboard.addUserGroup;
            break;
        case "PickupLocation" :
            importText = "Import Pickup Locations";
            addText = "Add Pickup Location";
            link = navigatingRoutes.dashboard.addPickupLocation;
            break;
        case "Promo" :
            importText = "Import Promo Codes";
            addText = "Add Promo Code";
            link = navigatingRoutes.dashboard.addPromo;
            break;
        case "Message" :
            importText = "Import Messages";
            addText = "Add Message";
            link = navigatingRoutes.dashboard.addMessage;
            break;
        case "PurchaseOrder" :
            importText = "Import Purchase Order";
            addText = "Add Purchase Order";
            link = navigatingRoutes.dashboard.addPurchaseOrder;
            break;
        case "SalesOrder" :
            importText = "Import Sales Order";
            addText = "Add Sales Order";
            link = navigatingRoutes.dashboard.addSalesOrder;
            break;
        case "Product" :
            importText = "Import Products";
            addText = "Add Product";
            link = navigatingRoutes.dashboard.addProduct;
            break;
        case "Package" :
            importText = "Import Packages";
            addText = "Add Package";
            link = navigatingRoutes.dashboard.addPackage;
            break;
        case "Support" :
            importText = "Import Support Tickets";
            addText = "Create Support Ticket";
            link = navigatingRoutes.dashboard.addSupport;
            break;
        case "Web Template" :
            importText = "Import Web Templates";
            addText = "Create Web Template";
            link = navigatingRoutes.dashboard.addWebTemplate;
            break;
    }

    const [open, setOpen] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState<FormData>(new FormData());

    // submit function to upload file to server
    const uploadFile = () => {
        const fileInput = document.getElementById("FileUp") as HTMLInputElement | null;
        if (fileInput?.files?.length === 0) {
            toast.error("Please Select a file First", notificationSettings);
        } else {
            //UserApi.ImportUsers(formData);
        }
    };

    // function to replace existing file with new file
    const fileUploadChange = () => {
        const fileInput = document.getElementById("FileUp") as HTMLInputElement;
        const updatedFormData = new FormData(); // Create a new FormData instance
        formData.forEach((value, name) => {
            updatedFormData.append(name, value);
        });

        for (let i = 0; i < fileInput.files!.length; i++) {
            const sfilename = fileInput.files![i].name;

            if (!updatedFormData.has(sfilename)) {
                updatedFormData.append(sfilename, fileInput.files![i]);
            }
        }

        setFormData(updatedFormData); // Assuming formdata is a state variable
    };

    return <>
        <Card
            style={{margin: 20}}
        >
            <CardContent>
                <div
                    style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}
                >
                    <div>
                        <LinkButton label = {importText} handleSubmit={() => setOpen(true)}/> &nbsp;&nbsp;&nbsp;
                        <BlueButton label = {addText} href={link} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            PaperComponent={(props) => <PaperComponent otherProps={props}>{props.children}</PaperComponent>}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogTitle id="draggable-dialog-title">
                Import Users
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You can import your users in the system directly by uploading a csv/xslx/xls files.<br/>
                    Depending on the size of your file this might take some time.<br />
                    There is a sample csv file below which contains the headers required for uploading the users data.<br /><br />
                    <a href="/static/Files/Import_Users_Template.xlsx">Import Users Template</a><br/>
                    <input type="file" id="FileUp" onChange={fileUploadChange} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={() => setOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={uploadFile} color="primary">
                    Import
                </Button>
            </DialogActions>
        </Dialog>
    </>;
};
export default Toolbar;