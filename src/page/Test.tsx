import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import _ from 'lodash';

interface Task {
  id: string;
  taskName: string;
}

interface Status {
  id: string;
  items: Task[];
}

interface State {
  toDo: Status;
  inProgress: Status;
  done: Status;
}

const DragAndDropDnD: React.FC = () => {
  const [state, setState] = useState<any>({
    toDo: {
      id: 'toDo',
      items: [
        { id: '1', taskName: 'Task-1' },
        { id: '2', taskName: 'Task-2' },
        { id: '3', taskName: 'Task-3' },
      ],
    },
    inProgress: {
      id: 'inProgress',
      items: [
        { id: '4', taskName: 'Task-4' },
        { id: '5', taskName: 'Task-5' },
        { id: '6', taskName: 'Task-6' },
      ],
    },
    done: {
      id: 'done',
      items: [
        { id: '7', taskName: 'Task-7' },
        { id: '8', taskName: 'Task-8' },
        { id: '9', taskName: 'Task-9' },
      ],
    },
  });

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const itemCopy = { ...state[source.droppableId].items[source.index] };

    const indexSource = state[source.droppableId].items.findIndex((item:any) => item.id === itemCopy.id);

    state[source.droppableId].items.splice(indexSource, 1);

    state[destination.droppableId].items.splice(destination.index, 0, itemCopy);

    setState({ ...state });
  };

  return (
    <div className='container'>
      <h3 className='text-center display-4'>Demo DragDrop DND</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className='row'>
          {_.map(state, (statusTask, index) => (
            <Droppable key={index} droppableId={statusTask.id}>
              {(provided) => (
                <div className='col-4'>
                  <div className='bg-dark p-5' ref={provided.innerRef} {...provided.droppableProps}>
                    {statusTask.items.map((item:any, index:any) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            className='text-center mt-2 p-2 bg-light'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {item.taskName}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default DragAndDropDnD;
