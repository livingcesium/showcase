import './App.css';
import { Route, Routes} from 'react-router-dom';
import Navbar from './components/Nav';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import FlexWrap from './components/Styling';


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

// Body components

function Home() {
  return (
    <div className="main">
      home
    </div>
  );
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

function Workspace() {
  const [columns, setColumns] = useState([getItems(10), getItems(5, 10)]);
  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const srcId = +source.droppableId;
    const destId = +destination.droppableId;

    if (srcId === destId) {
      const items = reorder(columns[srcId], source.index, destination.index);
      const newColumns = [...columns];
      newColumns[srcId] = items;
      setColumns(newColumns);
    } else {
      const result = move(columns[srcId], columns[destId], source, destination);
      const newColumns = [...columns];
      newColumns[srcId] = result[srcId];
      newColumns[destId] = result[destId];

      setColumns(newColumns.filter(group => group.length));
    }
  }


  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setColumns([...columns, []]);
        }}
      >
        Add new group
      </button>
      <button
        type="button"
        onClick={() => {
          setColumns([...columns, getItems(1)]);
        }}
      >
        Add new item
      </button>

      <FlexWrap>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around"
                            }}
                          >
                            {item.content}
                            <button
                              type="button"
                              onClick={() => {
                                const newState = [...state];
                                newState[ind].splice(index, 1);
                                setState(
                                  newState.filter(group => group.length)
                                );
                              }}
                            >
                              delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </FlexWrap>
    </div>
  );

}

function DropZone(){
  
}

export default App;
