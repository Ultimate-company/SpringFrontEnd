import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

interface TreeData1 {
    [key: string]: { label: string; value: string }[];
}

interface TreeData2 {
    [key: string]: string[];
}

type TreeData = TreeData1 | TreeData2;

const isTreeData1 = (data: any): data is TreeData1 => {
    const firstValue = Object.values(data)[0];
    return firstValue && Array.isArray(firstValue) && typeof firstValue[0] === 'object' && 'value' in firstValue[0];
};

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.grey[200],
    [`& .${treeItemClasses.content}`]: {
        borderRadius: theme.spacing(0.5),
        padding: theme.spacing(0.5, 1),
        margin: theme.spacing(0.2, 0),
        [`& .${treeItemClasses.label}`]: {
            fontSize: '0.8rem',
            fontWeight: 500,
        },
    },
    [`& .${treeItemClasses.iconContainer}`]: {
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.dark,
        padding: theme.spacing(0, 1.2),
        ...theme.applyStyles('light', {
            backgroundColor: alpha(theme.palette.primary.main, 0.25),
        }),
        ...theme.applyStyles('dark', {
            color: theme.palette.primary.contrastText,
        }),
    },
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
    ...theme.applyStyles('light', {
        color: theme.palette.grey[800],
    }),
}));

const renderTreeItems = (data: TreeData) => {
    if (isTreeData1(data)) {
        return Object.entries(data)
            .sort((a, b) => {
                const [keyA] = a;
                const [keyB] = b;
                return keyA.localeCompare(keyB); // Sort keys in descending order
            })
            .map(([key, items]) => (
                <CustomTreeItem key={key} itemId={key} label={key}>
                    {items.map((item, index) => (
                        <CustomTreeItem
                            key={index}
                            itemId={`${key}-${index}`}
                            label={item.value} // Access `value` for TreeData1
                        />
                    ))}
                </CustomTreeItem>
            ));
    } else {
        return Object.entries(data)
            .sort((a, b) => {
                const [keyA] = a;
                const [keyB] = b;
                return keyA.localeCompare(keyB); // Sort keys in descending order
            })
            .map(([key, items]) => (
                <CustomTreeItem key={key} itemId={key} label={key}>
                    {items.map((item, index) => (
                        <CustomTreeItem
                            key={index}
                            itemId={`${key}-${index}`}
                            label={item} // Directly use `item` for TreeData2 (string)
                        />
                    ))}
                </CustomTreeItem>
            ));
    }
};

export default function CustomTreeView({ data }: { data: TreeData }) {
    return (
        <Box sx={{ minHeight: 300, maxHeight: 300, overflowY: 'auto', minWidth: 250 }}>
            <SimpleTreeView defaultExpandedItems={[]} /* Pass an empty array to keep everything collapsed */>
                {renderTreeItems(data)}
            </SimpleTreeView>
        </Box>
    );
}