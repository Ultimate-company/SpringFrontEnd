import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";

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
    const removeOrdinalSuffix = (dateString: string) => {
        return dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');
    };

    const parsedValue = props.value ? dayjs(removeOrdinalSuffix(props.value as string)) : dayjs();

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    value={parsedValue}
                    label={props.label ?? ''}
                    disabled={props.disabled ?? false}
                    onChange={props.onChange}
                    slotProps={{ textField: { fullWidth: true } }}
                />
            </LocalizationProvider>
        </div>
    );
};

export default DateTimeInput;
