import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';

interface DateTimeInputProps {
    fullWidth: boolean; // Whether the input should take up the full width
    name: string; // The name of the input field
    required: boolean; // Whether the input is required
    value: string | null; // The current value of the input
    onChange: (value: any, context: any) => void; // Handler for value changes
    disabled: boolean; // Whether the input is disabled
    label: string; // Label for the input
}

const DateTimeInput = (props: DateTimeInputProps) => {
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker
                        value={props.value}
                        label={props.label ?? ''}
                        disabled={props.disabled ?? false}
                        onChange={props.onChange}
                    />
                </DemoContainer>
            </LocalizationProvider>
        </>
    );
};

export default DateTimeInput;
