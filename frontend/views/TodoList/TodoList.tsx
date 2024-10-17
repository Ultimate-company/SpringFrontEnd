import React from "react";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
    IconButton,
    Divider,
} from "@mui/material";
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import {Todo} from "Frontend/api/Models/CarrierModels/Todo";
import {toDoApi} from "Frontend/api/ApiCalls";
import OutletLayout from "Frontend/components/Layouts/DashboardLayout/OutletLayout";
import TextFieldInput from "Frontend/components/FormInputs/TextFieldInput";
import BlueButton from "Frontend/components/FormInputs/BlueButton";
import TaskList from "Frontend/components/TaskList";
import {useOutletContext} from "react-router-dom";

const initialState: Todo = {
    task: "",
    done: false
}

const TodoList = () => {
    // state variables
    const [setLoading] = useOutletContext<any>();
    const [toDoList, setToDoList] = React.useState<Todo[]>([]);
    const [state, setState] = React.useState<Todo>(initialState);

    const getAndSetItems = () => {
        toDoApi(setLoading).getItems()
            .then((response: Todo[]) => {
                setToDoList(response);
            });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    };

    const handleDone = (todoId: number) => {
        toDoApi(setLoading).toggleDone(todoId)
            .then((_: boolean) => {
                getAndSetItems();
            });
    }

    const handleToggle = (todoId: number) => {
        toDoApi(setLoading).deleteItem(todoId)
            .then((_: boolean) => {
                const newTodoList = [...toDoList];
                let index = -1;
                for (let i = 0; i < newTodoList.length; i++) {
                    if (newTodoList[i].todoId == todoId) {
                        index = i;
                        break;
                    }
                }

                if (index > -1) {
                    newTodoList.splice(index, 1); // 2nd parameter means remove one item only
                }

                setToDoList(newTodoList);
            });
    }

    React.useEffect(() => getAndSetItems(), []);

    // const classes = useStyles();
    return (
        <OutletLayout card={true}>
            <TextFieldInput
                name="task"
                value={state.task as string}
                label="My Task.."
                onChange={(event) => handleChange(event)}
                fullWidth={true}
                required={true}/>
            <br/><br/>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <BlueButton
                    label="Add task"
                    handleSubmit={() => {
                        toDoApi(setLoading).addItem({
                            task: state.task,
                            done: false
                        }).then((_: number) => {
                            let element = document.getElementById("task") as HTMLInputElement | null;
                            if (element) {
                                element.value = "";
                            }
                            setState({
                                task: "",
                                done: false
                            });
                            getAndSetItems();
                        });
                    }}/>
            </div>
            <br/><br/>
            <TaskList
                tasks={toDoList.filter(item => item.done !== undefined && !item.done)}
                title="My Pending Tasks"
                onDelete={(todoId: number) => handleToggle(todoId)}
                onToggleDone={(todoId: number) => handleDone(todoId)}
            />
            <br/><br/>
            <TaskList
                tasks={toDoList.filter(item => item.done !== undefined && item.done)}
                title="My Completed Tasks"
                onDelete={(todoId: number) => handleToggle(todoId)}
                onToggleDone={(todoId: number) => handleDone(todoId)}
            />
        </OutletLayout>
    );
}

export default TodoList;