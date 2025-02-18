import { getTask } from '@/services/TodoList';
import { useState } from 'react';

export default () => {
    const [task, setTask] = useState([]);

    const getTaskUser = async () => {
        const dataLocal: any = JSON.parse(localStorage.getItem('task') as any);
        if (!dataLocal?.length) {
            const res = await getTask();
            localStorage.setItem('task', JSON.stringify(res?.data ?? []));
            setTask(res?.data ?? []);
            return;
        }
        setTask(dataLocal);
    };

    return {
        task,
        setTask,
        getTaskUser,
    };
};