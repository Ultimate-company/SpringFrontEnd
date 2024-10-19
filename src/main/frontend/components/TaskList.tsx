import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import BodyText from './Fonts/BodyText';
import {IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import CheckboxInput from "Frontend/components/FormInputs/CheckboxInput";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {Todo} from "Frontend/api/Models/CarrierModels/Todo";

interface TaskListProps {
    tasks: Todo[];
    title: string;
    onDelete: (todoId: number) => void;
    onToggleDone: (todoId: number) => void;
}

const TaskList = (props: TaskListProps) => {
    return (
        <div>
            <BodyText text={props.title} />
            <Divider />
            <List sx={{ width: '100%', height: '30vh', overflowY: 'scroll', bgcolor: 'background.paper' }}>
                {props.tasks.map((item) => {
                    return (
                        <div key={item.todoId}>
                            <ListItem secondaryAction={
                                <IconButton
                                    onClick={() => props.onDelete(item.todoId as number)}
                                    edge="end"
                                    aria-label="comments"
                                >
                                    <FontAwesomeIcon icon={faTrash} size="xs" />
                                </IconButton>
                            }
                                      disablePadding
                            >
                                <ListItemButton
                                    role={undefined}
                                    onClick={() => props.onToggleDone(item.todoId as number)}
                                    dense
                                >
                                    <ListItemIcon>
                                        <CheckboxInput
                                            name={"checkbox_" + item.todoId}
                                            checked={item.done != undefined && item.done}
                                        />
                                    </ListItemIcon>

                                    {item.done != undefined && item.done ?
                                        <ListItemText id={(item.todoId as number).toString()} primary={item.task} style={{ textDecoration: "line-through" }} /> :
                                        <ListItemText id={(item.todoId as number).toString()} primary={item.task} />
                                    }

                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </div>
                    );
                })}
            </List>
        </div>
    );
};

export default TaskList;