export interface BaseId {
    id: number;
}


export interface HistoryTaskModel {
    id: number;
    taskId: number;
    code: string;
    name: string;
    nameTask: string;
    status: string;
    dateHanlder: string;
    dateRecive: string;
    processId: number;
}

export interface TasksMeModel {
    idNode: number;
    code: string;
    title: string;
    nameTask: string;
    type: string;
    dateCreate: string;
    steps: string;
    dateEx: string;
}

export interface FoldersModel {
    idNode: number;
    code: string;
    title: string;
    type: string;
    unit: string;
    partner: string;
    step: string;
    status: string;
    by: string;
    dateCreate: string;
    dateEx: string;
    currentStep: string;
}

