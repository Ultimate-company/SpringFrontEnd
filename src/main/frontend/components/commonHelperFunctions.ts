import {JSONNode} from "@atlaskit/editor-json-transformer";
import {
    faFileAlt,
    faFileArchive,
    faFileAudio,
    faFileCode,
    faFileExcel,
    faFileImage,
    faFilePdf,
    faFilePowerpoint,
    faFileVideo,
    faFileWord
} from "@fortawesome/free-solid-svg-icons";
import {blue, cyan, deepOrange, deepPurple, green, indigo, pink, red, teal, yellow} from "@mui/material/colors";
import {supportUrls} from "Frontend/api/Endpoints";
import {JSONDocNode} from "@atlaskit/editor-json-transformer/dist/types/types";
import {Body, Content} from "Frontend/api/Models/CarrierModels/Support";

export const country_arr = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Angola", "Anguilla", "Antartica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Ashmore and Cartier Island", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Clipperton Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czeck Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Europa Island", "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Gabon", "Gambia, The", "Gaza Strip", "Georgia", "Germany", "Ghana", "Gibraltar", "Glorioso Islands", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City)", "Honduras", "Hong Kong", "Howland Island", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Ireland, Northern", "Israel", "Italy", "Jamaica", "Jan Mayen", "Japan", "Jarvis Island", "Jersey", "Johnston Atoll", "Jordan", "Juan de Nova Island", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Man, Isle of", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Midway Islands", "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcaim Islands", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romainia", "Russia", "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Scotland", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and South Sandwich Islands", "Spain", "Spratly Islands", "Sri Lanka", "Sudan", "Suriname", "Svalbard", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tobago", "Toga", "Tokelau", "Tonga", "Trinidad", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "USA", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands", "Wales", "Wallis and Futuna", "West Bank", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];

export const getRandomColor = (userId?: number) => {
    const colors = [
        deepOrange[500],
        deepPurple[500],
        red[500],
        green[500],
        pink[500],
        blue[500],
        yellow[500],
        cyan[500],
        indigo[500],
        teal[500]
    ];

    // If no userId is provided or userId is invalid, return a random color
    if (!userId || userId <= 0) {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }

    // Map userId's last digit to a color
    const lastDigit = userId % 10;
    return colors[lastDigit];
};

export const getURLParamValue = (param: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    let ParamValue = urlParams.get(param);
    if (ParamValue == undefined) {
        return null;
    }
    return ParamValue;
};

export const isEditMode = (param: string) => {
    const paramValue = getURLParamValue(param);
    const isViewParam = getURLParamValue('isView');

    return (
        paramValue !== undefined &&
        paramValue !== null &&
        paramValue !== '' &&
        (isViewParam === undefined || isViewParam === null)
    );
}

export const isViewMode = (param: string) => {
    const paramValue = getURLParamValue(param);
    return (
        paramValue !== undefined &&
        paramValue !== null &&
        paramValue !== '' &&
        getURLParamValue("isView") !== undefined &&
        getURLParamValue("isView") !== null
    );
}

export const formatDate = (dateString: string, type: string) => {
    // format date to  yyyy-mm-dd
    if (dateString == "") return dateString;

    let d = new Date(dateString),
        month = "" + (d.getUTCMonth() + 1),
        day = "" + d.getUTCDate(),
        year = "" + d.getUTCFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (year.length < 4) year = year.padStart(4, '0');

    if (type == "yyyy-mm-dd") {
        return [year, month, day].join("-");
    } else if (type == "mm-dd-yyyy") {
        return [month, day, year].join("-");
    } else if (type == "mm/dd/yyyy") {
        return [month, day, year].join("/");
    } else if (type == "dd-mm-yyyy") {
        return [day, month, year].join("-");
    } else if (type == "yyyymmdd") {
        return [year, month, day].join("");
    } else if (type == "mmddyyyy") {
        return [month, day, year].join("");
    }
    else if(type == "mm dd yy, HH:mm"){
        const date = new Date(dateString);

        // Options for date and time formatting
        const dateOptions: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };

        // Get the day of the month
        const day = date.toLocaleDateString('en-US', { day: 'numeric' });

        // Determine the suffix
        const suffix = day.endsWith('1') && day !== '11' ? 'st' :
            day.endsWith('2') && day !== '12' ? 'nd' :
                day.endsWith('3') && day !== '13' ? 'rd' : 'th';

        // Format the date and time
        const formattedDate = date.toLocaleDateString('en-US', dateOptions).replace(day, `${day}${suffix}`);
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

        return `${formattedDate}, ${formattedTime}`;
    }
    else {
        return [year, month, day].join("-");
    }
}

export const formatPhoneNumber = (phoneNumber: string | undefined): string => {
    if (!phoneNumber) return ''; // Return empty string if phoneNumber is undefined

    // Remove non-digit characters from phoneNumber
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

    // Apply the mask "999-9999-999"
    return cleanedPhoneNumber.replace(/(\d{3})(\d{4})(\d{3})/, '$1-$2-$3');
};

export const isDateGreaterThanOrEqualToToday = (date: Date): boolean => {
    // Get today's date at 0 hours, 0 minutes, 0 seconds, and 0 milliseconds
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the passed date at 0 hours, 0 minutes, 0 seconds, and 0 milliseconds
    const passedDate = new Date(date);
    passedDate.setHours(0, 0, 0, 0);

    // Compare the dates
    return passedDate.getTime() < today.getTime();
}

export function formatAmount(amount: string): string {
    // Parse the string to a number
    const numberAmount = parseFloat(amount);

    // Check if the input is a valid number
    if (isNaN(numberAmount)) {
        return "Invalid input";
    }

    // Format the number as a comma-separated string
    return numberAmount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function imageToByteArray(imageFile: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            // Remove metadata
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);

            }
            const byteArray = new Uint8Array(byteNumbers);
            resolve(byteArray);

        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
    });
}
function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = '';
    const len = uint8Array.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(uint8Array[i]);
    }

    return btoa(binary);
}

export async function imageToByteArrayMap(images: Map<string, File | undefined>): Promise<Map<string, string>> {
    let byteArrayMap: Map<string, string> = new Map<string, string>();

    for (const [imageId, imageFile] of images) {
        if(imageFile != undefined) {
            byteArrayMap.set(imageId, uint8ArrayToBase64(await imageToByteArray(imageFile)));
        }
        else {
            byteArrayMap.set(imageId, "");
        }
    }

    return byteArrayMap;
}

export function removeHtmlTags(str: String) {
    return str.replace(/<\/?[^>]+>/gi, '');
}

export const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'pdf':
            return faFilePdf;
        case 'doc':
        case 'docx':
            return faFileWord;
        case 'xls':
        case 'xlsx':
            return faFileExcel;
        case 'ppt':
        case 'pptx':
            return faFilePowerpoint;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return faFileImage;
        case 'txt':
            return faFileAlt;
        case 'mp4':
        case 'avi':
            return faFileVideo;
        case 'mp3':
            return faFileAudio;
        case 'zip':
        case 'rar':
            return faFileArchive;
        case 'html':
        case 'js':
        case 'css':
            return faFileCode;
        default:
            return faFileAlt;
    }
};

export const renderComment = (comment: string, body: Body) => {
    // Convert body to JSONDocNode
    const convertBodyToJSONDocNode = (body: Body): JSONDocNode => {
        const convertContent = (content: Content[]): JSONNode[] => {
            return content.map(item => ({
                type: item.type ?? '',
                attrs: item.attrs,
                content: item.content ? convertContent(item.content) : undefined,
                marks: item.marks,
                text: item.text
            }));
        };

        return {
            version: body.version ?? 1, // Assuming version 1 if not provided
            type: 'doc',
            content: body.content ? convertContent(body.content) : []
        };
    };

    // Convert JSONNode to HTML
    const jsonNodeToHtml = (node: JSONNode): string => {
        if (node.type === 'text' && node.text) {
            return node.text;
        }

        let html = '';
        const addTag = (tag: string, isClosing: boolean = false) => {
            html += isClosing ? `</${tag}>` : `<${tag}>`;
        };

        switch (node.type) {
            case 'paragraph': addTag('p'); break;
            case 'heading': {
                const level = (node.attrs as { [key: string]: any }).level || 1;
                addTag(`h${level}`); break;
            }
            case 'bulletList': addTag('ul'); break;
            case 'orderedList': addTag('ol'); break;
            case 'listItem': addTag('li'); break;
            case 'blockquote': addTag('blockquote'); break;
            case 'codeBlock': addTag('pre'); addTag('code'); break;
            case 'mediaSingle': addTag('div', false); html += '<div style="text-align:center;">'; break;
            case 'media':
                const mediaAttrs = node.attrs as { [key: string]: any };
                html += `<img src="${mediaAttrs.url || ''}" alt="">`;
                break;
            default: addTag('div'); break;
        }

        if (node.content) {
            node.content.forEach(childNode => childNode && (html += jsonNodeToHtml(childNode)));
        }

        switch (node.type) {
            case 'paragraph': addTag('p', true); break;
            case 'heading': {
                const level = (node.attrs as { [key: string]: any }).level || 1;
                addTag(`h${level}`); break;
            }
            case 'bulletList': addTag('ul', true); break;
            case 'orderedList': addTag('ol', true); break;
            case 'listItem': addTag('li', true); break;
            case 'blockquote': addTag('blockquote', true); break;
            case 'codeBlock': addTag('code', true); addTag('pre', true); break;
            case 'mediaSingle': addTag('div', true); break;
            default: addTag('div', true); break;
        }

        return html;
    };

    // Process comment
    if (comment.includes('<span class="error">Can only create thumbnails for attached images</span>')) {
        let jsonNodes = convertBodyToJSONDocNode(body).content;
        let html = jsonNodes.map(jsonNodeToHtml).join("");

        // Process image replacement in HTML
        let attachmentIndex = 1;
        html = html.replace(/<img\s+[^>]*src="https:\/\/[^\s]+\/rest\/api\/3\/attachment\/content\/(\d+)"[^>]*>/gi, (match, id) => {
            return `<a href="${supportUrls.getAttachmentById}/${id}" download>Attachment ${attachmentIndex++}</a>`;
        });

        return html;
    }

    // Replace <img> src attributes
    comment = comment.replace(/<img\s+[^>]*src="\/rest\/api\/3\/attachment\/content\/(\d+)"[^>]*>/gi, (match, id) => {
        const imgName = match.match(/alt="([^"]*)"/)?.[1] || 'Image';
        return `<a href="${supportUrls.getAttachmentById}/${id}" download>${imgName}</a>`;
    });

    // Replace <a> href attributes with a download link
    comment = comment.replace(/<a\s+[^>]*href="\/rest\/api\/3\/attachment\/content\/(\d+)"[^>]*>(.*?)<\/a>/gi, (match, id, fileName) => {
        const filenameMatch = match.match(/<jira-attachment-thumbnail[^>]*filename="([^"]+)"/i);
        const extractedFilename = filenameMatch ? filenameMatch[1] : fileName;
        return `<a href="${supportUrls.getAttachmentById}/${id}" download>${extractedFilename}</a>`;
    });

    // Remove <span class="image-wrap"> wrapper but keep the <a> tag intact
    comment = comment.replace(/<p><span\s+class="image-wrap"[^>]*>(<a\s+[^>]*>[^<]*<\/a>)<\/span><\/p>/gi, '$1');

    // Add three white spaces before every <a> tag
    comment = comment.replace(/<a\s+/gi, '&nbsp;<a ');

    return comment;
};

export const removeAnchorAndImageTagsFromHTML = (htmlContent: string): string => {
    // Remove <a> tags along with their content
    htmlContent = htmlContent.replace(/<a\s+[^>]*>.*?<\/a>/gis, '');

    // Remove <img> tags
    htmlContent = htmlContent.replace(/<img\s+[^>]*>/gi, '');

    return htmlContent;
}