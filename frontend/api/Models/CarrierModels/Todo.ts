export type Todo = {
    todoId?: number;
    task?: string;
    done: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
    userId?: number;
};