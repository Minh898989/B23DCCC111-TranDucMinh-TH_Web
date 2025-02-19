Skip to content
Navigation Menu
Minh898989
B23DCCC111-TranDucMinh-TH_Web

Type / to search
Code
Issues
Pull requests
Actions
Projects
Wiki
Security
Insights
Settings
B23DCCC111-TranDucMinh-TH_Web/Day2/baseltw/src/models
/todolist.ts
Go to file
t
Minh898989
Minh898989
update
0fdbc1a
 · 
13 hours ago

Code

Blame
23 lines (20 loc) · 594 Bytes
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
