import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import FlexWrap from './Styling';

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
  
  // fake data generator
  const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
      id: `item-${k + offset}-${new Date().getTime()}`,
      content: `item ${k + offset}`
    }));

  

    
  const CardContext = React.createContext();
  
  function Workspace() {
    return (
      <CardProvider>
        <CardSpace />
      </CardProvider>
    );
  }

  function CardProvider({children}) {
    const [columns, setColumns] = useState([getItems(10), getItems(5, 10)]); // 2D space of cards (List of card lists)
  
    return (
      <CardContext.Provider value={{columns, setColumns}}>
        {children}
      </CardContext.Provider>
    )
  }
  
  function CardSpace() {
    const {columns, setColumns} = React.useContext(CardContext); // 2D space of cards (List of card lists)
    const localSwap = ({src, srcRow}, dest) => {
      const items = reorder(columns[srcRow], src.Row, dest.Row);
      const newColumns = [...columns];
      newColumns[srcRow] = items;
      setColumns(newColumns);
    }
    const transfer = ({src, srcRow}, { dest, destRow }) => {
      const result = move(columns[srcRow], columns[destRow], src, dest);
      const newColumns = [...columns];
      newColumns[srcRow] = result[srcRow];
      newColumns[destRow] = result[destRow];
  
      setColumns(newColumns.filter(group => group.length));
    }
    const remove = (colIndex, index) => {
      const newColumns = [...columns];
      newColumns[colIndex].splice(index, 1);
      setColumns(
        newColumns.filter(group => group.length)
      );
    }
    const refresh = () => {
      setColumns([...columns]);
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
          <DropZone cardLists={columns} onLocal = {localSwap} onOther = {transfer} cardActions = {{remove}} onReady = {refresh}/>
        </FlexWrap>
      </div>
    );
  
  }
  
  function DropZone({cardLists, onLocal, onOther, onReady, cardActions = {}}){
  
    useEffect(()=>{
      onReady()
    }, [])
    function onDragEnd(result) {
      const { source, destination } = result;
  
      // dropped outside the list
      if (!destination) {
        return
      }
      console.log(result, source, destination)
      const srcId = +source.droppableId;
      const destId = +destination.droppableId;
  
  
      if (srcId === destId)
        onLocal({src: source, srcRow: srcId}, destination) 
      else
        onOther({src: source, srcRow: srcId}, {dest: destination, destRow: destId})
    }
  
    const generateColumns = () => {
  
      return cardLists.map((cards, ind) => (
        <Droppable key={ind} droppableId={`${ind}`}>
          {(provided, snapshot) => (
            <Column {...provided} {...snapshot} cardActions={cardActions} index={ind} contents={cards}/>
          )}
        </Droppable>
      ))
    }
    return (
      <DragDropContext onDragEnd={onDragEnd} onDragStart={(start) => console.log(start)}>
        {generateColumns()}
      </DragDropContext>
    )
  }
  
  function Column({innerRef, isDraggingOver, droppableProps, index, cardActions, contents, placeholder}){
    const generateCards = (cards) => {
      return cards.map((card, ind) => (
        <Draggable 
          key={card.id} draggableId={card.id} index={ind}>
          {(provided, snapshot) => (
            <Card card={card} {...provided} {...snapshot} colIndex={index} index={ind} actions={cardActions}/>
          )}
        </Draggable>
      ))
    }
  
    
    return (
      <div
        ref={innerRef}
        style={getListStyle(isDraggingOver)}
        {...droppableProps}
      >
        {generateCards(contents)}
        {placeholder}
      </div>
    )
  }
  
  function present(action){
    return typeof action === 'function';
  }
  
  function Card({card, colIndex, index, innerRef, isDragging, draggableProps, dragHandleProps, actions}){
    
    const actionElements = [
      present(actions.remove) ? // if remove is present, add delete button
        <button
          type="button"
          onClick={() => {
            actions.remove(colIndex, index);
          }}
        >
          delete
        </button> 
      : [/* not added if action not present */],
      // add actions here...
    ]
    return (
      <div
        ref={innerRef}
        {...draggableProps}
        {...dragHandleProps}
        style={getItemStyle(
          isDragging,
          draggableProps.style
        )}
      >
        <FlexWrap 
        style={{
          justifyContent: "space-around"
        }}>
          {card.content}
          {actionElements.map((action, ind) => (
              <div key={ind}>
                {action}
              </div>
            ))
          }
        </FlexWrap>
      </div>
    )
  }

export default Workspace;